export type Service = {
  type: string;
  name: string;
  "consent-category"?: string;
  src?: string;
  gtag?: string;
  cookies?: string[];
  handleEnable?: string;
  handleDisable?: string;
};

export type Category = {
  category: string;
  services: Service[];
  hide: boolean;
  editable: boolean;
  enabled: boolean;
};

export type CategoryWithoutServices = Omit<Category, "services">;

export type CookieConsent = {
  consentGiven: boolean;
  categories: Category[];
};
