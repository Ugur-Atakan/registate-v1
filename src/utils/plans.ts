  export interface PlanFeature {
    id: string;
    name: string;
    price?: number;
  }

  export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    subtitle: string;
    features: PlanFeature[];
  }

  export interface PricingPlans {
    silver: PricingPlan;
    gold: PricingPlan;
    platinum: PricingPlan;
  }

  // Özelliklerin merkezi listesi
export const planFeatures: Record<string, PlanFeature> = {
  formation: { id: "formation", name: "Formation" ,price: 0},
  registeredAgent: { id: "registered-agent", name: "Registered Agent", price: 0 },
  companyNameCheck: { id: "company-name-check", name: "Free Company Name Check",  price: 0},
  formationDocuments: { id: "formation-documents", name: "All Formation Documents", price: 20 },
  onlineDashboard: { id: "online-dashboard", name: "Access to Registate Online Dashboard", price: 10 },
  customerSupport: { id: "customer-support", name: "Lifetime Customer Support", price: 0 },
  ein: { id: "ein", name: "EIN (Employer Identification Number)", price: 0 },
  virtualMailbox: { id: "virtual-mailbox", name: "Virtual Mailbox (lowest package)", price: 0 },
  complianceReminder: { id: "compliance-reminder", name: "Compliance Reminder", price: 19 },
  bankAccountGuide: { id: "bank-account-guide", name: "Bank Account Guide" , price: 16},
  annualReportFiling: { id: "annual-report-filing", name: "Annual Report Filing & Franchise Tax", price: 14 },
  boiReportFiling: { id: "boi-report-filing", name: "BOI Report Filing" , price: 23},
  postIncDocuments: { id: "post-inc-documents", name: "Post-Inc Documents (one-time submission)", price: 10 },
};

  // Planları oluştur
  export const pricingPlans:PricingPlans = {
    silver: {
      id: "silver",
      name: "Silver Plan",
      price: 147,
      subtitle: "Basic Formation Package",
      features: [
        planFeatures.formation,
        planFeatures.registeredAgent,
        planFeatures.companyNameCheck,
        planFeatures.formationDocuments,
        planFeatures.onlineDashboard,
        planFeatures.customerSupport,
      ],
    },
    gold: {
      id: "gold",
      name: "Gold Plan",
      price: 287,
      subtitle: "Essentials for a Bank Account",
      features: [
        planFeatures.formation,
        planFeatures.registeredAgent,
        planFeatures.companyNameCheck,
        planFeatures.formationDocuments,
        planFeatures.onlineDashboard,
        planFeatures.customerSupport,
        planFeatures.ein,
        planFeatures.virtualMailbox,
        planFeatures.complianceReminder,
        planFeatures.bankAccountGuide,
      ],
    },
    platinum: {
      id: "platinum",
      name: "Platinum Plan",
      price: 623,
      subtitle: "Full Compliance",
      features: Object.values(planFeatures), // Tüm özellikleri içerir
    },
  };

  export const upsellItems: { [key in "silver" | "gold" | "platinum"]: string[] } = {
    silver: [
      planFeatures.ein.id,
      planFeatures.virtualMailbox.id,
      planFeatures.complianceReminder.id,
      planFeatures.bankAccountGuide.id,
      planFeatures.annualReportFiling.id,
      planFeatures.boiReportFiling.id,
      planFeatures.postIncDocuments.id,
    ],
    gold: [
      planFeatures.annualReportFiling.id,
      planFeatures.boiReportFiling.id,
      planFeatures.postIncDocuments.id,
    ],
    platinum: [] // Platinum paketinde tüm özellikler dahil olduğu için addon yok
  };