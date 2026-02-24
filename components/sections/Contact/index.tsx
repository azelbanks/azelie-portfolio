'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Mail, 
  Linkedin, 
  Github, 
  Download, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MessageSquare,
  FileText
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Types
interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// Validation
function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.name.trim()) {
    errors.name = 'Veuillez entrer votre nom';
  }
  
  if (!data.email.trim()) {
    errors.email = 'Veuillez entrer votre email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Format d\'email invalide';
  }
  
  if (!data.message.trim()) {
    errors.message = 'Veuillez entrer un message';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message trop court (minimum 10 caractères)';
  }
  
  return errors;
}

// Liens sociaux
const socialLinks = [
  { 
    id: 'linkedin',
    icon: Linkedin, 
    href: 'https://www.linkedin.com/in/azélie-bernard',
    label: 'LinkedIn',
  },
  { 
    id: 'github',
    icon: Github, 
    href: 'https://github.com/azelie-bernard', 
    label: 'GitHub',
  },
  { 
    id: 'email',
    icon: Mail, 
    href: 'mailto:azeliebernard@gmail.com',
    label: 'Email',
  },
];

// Composant principal
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const mode = useAppStore(state => state.mode);
  const markSectionDiscovered = useAppStore(state => state.markSectionDiscovered);
  const getProgress = useAppStore(state => state.getProgress);
  const badges = useAppStore(state => state.badges);
  
  // États du formulaire
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [honeypot, setHoneypot] = useState('');
  
  // Marquer section découverte
  useEffect(() => {
    if (isInView) {
      markSectionDiscovered('contact');
    }
  }, [isInView, markSectionDiscovered]);
  
  // Validation en temps réel
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const newErrors = validateForm(formData);
      setErrors(newErrors);
    }
  }, [formData, touched]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({ name: true, email: true, message: true });
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    // Anti-bot : si le honeypot est rempli, c'est un bot
    if (honeypot) {
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    setSubmitStatus('loading');

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company,
      message: formData.message,
    };

    try {
      // Envoi du message principal
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Envoi de l'auto-reply au visiteur
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTouched({});

      setTimeout(() => setSubmitStatus('idle'), 5000);

    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };
  
  // Téléchargement du CV
  const handleDownloadCV = () => {
    // Créer un lien temporaire pour le téléchargement
    // Le CV doit être placé dans /public/cv/
    const cvFileName = mode === 'strategist' 
      ? 'CV_Azelie_Bernard_Chef_de_Projet.pdf'
      : 'CV_Azelie_Bernard_Data_IA.pdf';
    
    const link = document.createElement('a');
    link.href = `/cv/${cvFileName}`;
    link.download = cvFileName;
    link.target = '_blank';
    
    // Si le fichier n'existe pas, ouvrir dans un nouvel onglet
    // pour éviter une erreur silencieuse
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const progress = mounted ? getProgress() : 0;
  const unlockedBadges = mounted ? badges.filter(b => b.unlocked) : [];
  
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section relative overflow-hidden"
    >
      {/* Fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-4">
            <MessageSquare size={16} />
            Contact
          </div>
          
          <h2 className="text-display font-heading font-bold text-foreground-primary mb-4">
            Contactez-moi
          </h2>
          
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-6">
            Vous avez un projet ? Une opportunité ? N'hésitez pas à me contacter.
          </p>
          
          <div className="w-20 h-1 bg-accent-primary mx-auto" />
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot anti-bot - invisible pour les humains */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                aria-hidden="true"
              />
              {/* Nom */}
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-foreground-primary"
                >
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg transition-all duration-300',
                    'bg-background-secondary border outline-none',
                    'focus:ring-2 focus:ring-accent-primary/50',
                    touched.name && errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-border-primary/30 focus:border-accent-primary'
                  )}
                  placeholder="Votre nom"
                />
                {touched.name && errors.name && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-foreground-primary"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg transition-all duration-300',
                    'bg-background-secondary border outline-none',
                    'focus:ring-2 focus:ring-accent-primary/50',
                    touched.email && errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-border-primary/30 focus:border-accent-primary'
                  )}
                  placeholder="votre@email.com"
                />
                {touched.email && errors.email && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Entreprise */}
              <div>
                <label 
                  htmlFor="company"
                  className="block text-sm font-medium mb-2 text-foreground-primary"
                >
                  Entreprise <span className="text-foreground-muted text-xs">(optionnel)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-300 bg-background-secondary border border-border-primary/30 outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary"
                  placeholder="Votre entreprise"
                />
              </div>
              
              {/* Message */}
              <div>
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-foreground-primary"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg transition-all duration-300 resize-none',
                    'bg-background-secondary border outline-none',
                    'focus:ring-2 focus:ring-accent-primary/50',
                    touched.message && errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-border-primary/30 focus:border-accent-primary'
                  )}
                  placeholder="Votre message..."
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.message}
                  </p>
                )}
              </div>
              
              {/* Bouton submit */}
              <motion.button
                type="submit"
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg',
                  'font-medium transition-all duration-300',
                  submitStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : submitStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-accent-primary text-background-primary hover:opacity-90',
                  (submitStatus === 'loading' || submitStatus === 'success') && 'opacity-80 cursor-not-allowed'
                )}
                whileHover={submitStatus === 'idle' ? { scale: 1.02 } : {}}
                whileTap={submitStatus === 'idle' ? { scale: 0.98 } : {}}
              >
                {submitStatus === 'loading' && (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </>
                )}
                {submitStatus === 'success' && (
                  <>
                    <CheckCircle size={18} />
                    Message envoyé !
                  </>
                )}
                {submitStatus === 'error' && (
                  <>
                    <AlertCircle size={18} />
                    Erreur, réessayez
                  </>
                )}
                {submitStatus === 'idle' && (
                  <>
                    <Send size={18} />
                    Envoyer
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Téléchargement CV */}
            <div className="p-5 rounded-xl bg-background-secondary/50 backdrop-blur-sm border border-border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-accent-primary" size={22} />
                <h3 className="text-lg font-semibold text-foreground-primary">
                  Mon CV
                </h3>
              </div>
              
              <p className="text-sm text-foreground-muted mb-4">
                {mode === 'strategist' 
                  ? 'CV orienté gestion de projet et financements européens.'
                  : 'CV orienté data et développement.'}
              </p>
              
              <button
                onClick={handleDownloadCV}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-accent-primary/50 text-accent-primary hover:bg-accent-primary hover:text-background-primary transition-all duration-300"
                aria-label="Télécharger le CV au format PDF"
              >
                <Download size={18} />
                Télécharger le CV
              </button>
              
              <p className="text-xs text-foreground-muted mt-3 text-center">
                💡 Changez de mode (Stratège/Tech) pour télécharger l'autre version
              </p>
            </div>
            
            {/* Liens sociaux */}
            <div className="p-5 rounded-xl bg-background-secondary/50 backdrop-blur-sm border border-border-primary/30">
              <h3 className="text-lg font-semibold mb-4 text-foreground-primary">
                Me retrouver
              </h3>
              
              <div className="flex gap-3">
                {socialLinks.map(link => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-background-primary border border-border-primary/30 text-foreground-muted hover:text-accent-primary hover:border-accent-primary/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    <link.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Progression et badges */}
            <div className="p-5 rounded-xl bg-background-secondary/50 backdrop-blur-sm border border-border-primary/30">
              <h3 className="text-lg font-semibold mb-4 text-foreground-primary">
                Vous connaissez Azélie à {progress}%
              </h3>
              
              {/* Barre de progression */}
              <div className="h-2.5 rounded-full bg-background-primary overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              
              {/* Badges débloqués */}
              {unlockedBadges.length > 0 && (
                <div>
                  <p className="text-sm mb-3 text-foreground-muted">
                    Badges débloqués :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {unlockedBadges.map(badge => (
                      <motion.div
                        key={badge.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-accent-primary/10 text-accent-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        title={badge.description}
                      >
                        <span>{badge.icon}</span>
                        <span className="text-xs">{badge.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {progress < 100 && (
                <p className="text-xs mt-4 text-foreground-muted">
                  Explorez toutes les sections pour débloquer plus de badges !
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
