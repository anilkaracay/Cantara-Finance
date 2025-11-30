import CantonLogo from "@/components/svgs/partnersLogo/CantonLogo";
import ColendiLogo from "@/components/svgs/partnersLogo/ColendiLogo";
import GoldtagLogo from "@/components/svgs/partnersLogo/GoldtagLogo";
import RepublicLogo from "@/components/svgs/partnersLogo/RepublicLogo";
import WhitebitLogo from "@/components/svgs/partnersLogo/WhitebitLogo";
import Image from "next/image";

export const getPartnerLogo = (partner) => {
  switch (partner) {
    case "1":
      return <CantonLogo />;
    case "2":
      return <GoldtagLogo />;
    case "3":
      return <WhitebitLogo />;
    case "4":
      return <RepublicLogo />;
    case "5":
      return <ColendiLogo />;
  }
};

export const getPartnerLogoPNG = (partner) => {
  switch (partner) {
    case "1":
      return "/images/partnersLogo/CantonLogo.png";
    case "2":
      return "/images/partnersLogo/GoldtagLogo.png";
    case "3":
      return "/images/partnersLogo/WhitebitLogo.png";
    case "4":
      return "/images/partnersLogo/RepubligLogo.png";
    case "5":
      return "/images/partnersLogo/ColendiLogo.png";
    default:
      return "/images/partnersLogo/CantonLogo.png";
  }
};

export const getBuiltForTrustImages = (partner) => {
  switch (partner) {
    case "1":
      return "/images/dashboardImages/Transparency.png";
    case "2":
      return "/images/dashboardImages/Privacy.png";
    case "3":
      return "/images/dashboardImages/RiskManagement.png";
    case "4":
      return "/images/dashboardImages/CapitalEfficiency.png";
    default:
      return "/images/dashboardImages/Transparency.png";
  }
};
