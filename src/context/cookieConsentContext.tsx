import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import CookieConsentModal from "src/components/CookieConsent/CookieConsentModal";
import {
  cookieConsentInitialObject,
  handleConsentChanges,
} from "src/cookieConsentManager";
import {
  CategoryWithoutServices,
  CookieConsent,
} from "src/types/cookieConsent";

type CookieConsentContextType = {
  consentState: CookieConsent;
  // eslint-disable-next-line no-unused-vars
  updateConsent: (updatedCategories: CategoryWithoutServices[]) => void;
  isConsentModalOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsConsentModalOpen: (isOpen: boolean) => void;
};

// Default value for context
const defaultContextValue: CookieConsentContextType = {
  consentState: cookieConsentInitialObject as CookieConsent,
  updateConsent: () => {},
  isConsentModalOpen: false,
  setIsConsentModalOpen: () => {},
};

export const CookieConsentContext =
  createContext<CookieConsentContextType>(defaultContextValue);

type CookieConsentProviderProps = {
  children: ReactNode;
};

export default function CookieConsentProvider({
  children,
}: CookieConsentProviderProps) {
  const [consentState, setConsentState] = useState(
    cookieConsentInitialObject as CookieConsent
  );
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const [isInitialLoad, setIsIntialLoad] = useState(true);

  // Runs only on the client after the first render
  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    const parsedConsent = storedConsent ? JSON.parse(storedConsent) : null;
    if (parsedConsent) {
      // if there is consent in local storage set it to state
      handleConsentChanges(parsedConsent.categories);
      setConsentState(parsedConsent);
    } else {
      //otherwise set the initial object to consent in local storage
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify(cookieConsentInitialObject)
      );
    }
    if (!parsedConsent?.consentGiven) setIsConsentModalOpen(true);
  }, []);

  useEffect(() => {
    // handle changes in consent state
    if (isInitialLoad) {
      setIsIntialLoad(false);
    } else {
      localStorage.setItem("cookieConsent", JSON.stringify(consentState));
      handleConsentChanges(consentState.categories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentState]);

  const updateConsent = (updatedCategories: CategoryWithoutServices[]) => {
    const newCategories = consentState.categories.map((cat) => {
      const updatedCategory = updatedCategories.find(
        (uc) => uc.category === cat.category
      );
      return updatedCategory
        ? { ...cat, enabled: updatedCategory.enabled }
        : cat;
    });
    setConsentState({
      ...consentState,
      categories: newCategories,
      consentGiven: true,
    });
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        updateConsent,
        isConsentModalOpen,
        setIsConsentModalOpen,
      }}
    >
      {children}
      <CookieConsentModal />
    </CookieConsentContext.Provider>
  );
}

export const useCookieConsentContext = () => useContext(CookieConsentContext);
