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
    title: "Bill Payments",
    icon: BillIcon,
    href: "bill",
  },
  {
    title: "Variation Services",
    icon: VariationIcon,
    href: "variation",
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
    title: "Transaction History",
    icon: TransactionIcon,
    href: "transaction",
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
