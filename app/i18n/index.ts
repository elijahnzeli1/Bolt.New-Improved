import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Bolt",
          feedback: "Your feedback is important to us",
          submit: "Submit",
          cancel: "Cancel",
          name: "Name",
          email: "Email",
          fileUpload: "Upload Project (ZIP)",
          comment: "Comment",
          addComment: "Add a comment",
          errorEmptyComment: "Comment cannot be empty.",
          errorFeedbackEmpty: "Feedback cannot be empty.",
          successFeedback: "Feedback submitted successfully.",
          errorFeedbackSubmit: "Error submitting feedback. Please try again.",
          imageUpload: "Upload Image",
          errorUnsupportedFileType: "Unsupported file type. Please upload an image.",
          errorFileSizeExceeded: "File size exceeds the limit of 5MB.",
          loadLocalProject: "Load Local Project",
          errorFileRead: "Failed to read file. Please try again.",
        },
      },
      es: {
        translation: {
          welcome: "Bienvenido a Bolt",
          feedback: "Your feedback is important to us",
          submit: "Submit",
          cancel: "Cancel",
          name: "Name",
          email: "Email",
          fileUpload: "Upload Project (ZIP)",
          comment: "Comment",
          addComment: "Add a comment",
          errorEmptyComment: "Comment cannot be empty.",
          errorFeedbackEmpty: "Feedback cannot be empty.",
          successFeedback: "Feedback submitted successfully.",
          errorFeedbackSubmit: "Error submitting feedback. Please try again.",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue à Bolt",
          feedback: "Votre retour est important pour nous",
          submit: "Soumettre",
          cancel: "Annuler",
          name: "Nom",
          email: "Email",
          fileUpload: "Télécharger le projet (ZIP)",
          comment: "Commentaire",
          addComment: "Ajouter un commentaire",
          errorEmptyComment: "Le commentaire ne peut pas être vide.",
          errorFeedbackEmpty: "Le retour ne peut pas être vide.",
          successFeedback: "Retour soumis avec succès.",
          errorFeedbackSubmit: "Erreur lors de l'envoi du retour. Veuillez réessayer.",
        },
      },
      de: {
        translation: {
          welcome: "Willkommen bei Bolt",
          feedback: "Ihr Feedback ist uns wichtig",
          submit: "Einreichen",
          cancel: "Abbrechen",
          name: "Name",
          email: "E-Mail",
          fileUpload: "Projekt hochladen (ZIP)",
          comment: "Kommentar",
          addComment: "Kommentar hinzufügen",
          errorEmptyComment: "Kommentar darf nicht leer sein.",
          errorFeedbackEmpty: "Feedback darf nicht leer sein.",
          successFeedback: "Feedback erfolgreich eingereicht.",
          errorFeedbackSubmit: "Fehler beim Einreichen des Feedbacks. Bitte versuchen Sie es erneut.",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: false, // We do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false,
    },
  })
  .catch((error) => {
    console.error('Error initializing i18n:', error);
  });

export default i18n;