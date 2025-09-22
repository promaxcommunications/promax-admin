import {
  OverviewIcon,
  BillIcon,
  DepositIcon,
  MarkupIcon,
  NotificationIcon,
  ReferralIcon,
  SettingIcon,
  TransactionIcon,
  UserIcon,
  VariationIcon,
} from "./components/icons";

export const navLinks = [
  {
    title: "Overview",
    icon: OverviewIcon,
    href: "overview",
  },
  {
    title: "Users",
    icon: UserIcon,
    href: "users",
  },
  {
    title: "Transaction History",
    icon: TransactionIcon,
    href: "transaction",
  },
  {
    title: "Variation Services",
    icon: VariationIcon,
    href: "variation",
  },
  {
    title: "Bundle Plans",
    icon: BillIcon,
    href: "plans",
  },
  {
    title: "Markup Services",
    icon: MarkupIcon,
    href: "markup",
  },
  {
    title: "Deposit History",
    icon: DepositIcon,
    href: "deposit",
  },
  {
    title: "Bill Payments",
    icon: BillIcon,
    href: "bill",
  },
  {
    title: "Referrals",
    icon: ReferralIcon,
    href: "referrals",
  },
  {
    title: "Notifications",
    icon: NotificationIcon,
    href: "notifications",
  },
  {
    title: "Admin Settings",
    icon: SettingIcon,
    href: "settings",
  },
];

export function parseDateTime(isoString: string) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short", // e.g. "Wed"
    year: "numeric",
    month: "short", // e.g. "Sept"
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export function formatToNaira(amount: number | string) {
  amount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amount)) return "Invalid number";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const formatNetworks = (
  data: Record<string, { serviceID: string; variations: any[] }>
) => {
  const formatted: Record<string, any[]> = {};

  for (const key in data) {
    if (data[key].variations) {
      formatted[key] = data[key].variations;
    }
  }

  return formatted;
};
