import type { ClimateId, RoleRef } from "../../app/session/types";

export const climateLabels: Record<ClimateId, string> = {
  bull: "Bull",
  stag: "Stag",
  lion: "Lion",
  bear: "Bear",
  peacock: "Peacock",
};

export const chairmanClimateRules: Record<
  ClimateId,
  {
    debt: string;
    requestMore: number;
    requestLess: number | null;
    humanCrownAllocation: number;
    allocation: string[];
  }
> = {
  bull: {
    debt: "Advance once for each Presidency with an open home port.",
    requestMore: 1,
    requestLess: 2,
    humanCrownAllocation: 3,
    allocation: [
      "Allocate £4 to each Presidency with an open home port.",
      "Allocate £5 to the Director of Trade or Governor General.",
    ],
  },
  stag: {
    debt: "Advance once for each Crown Presidency with an open home port.",
    requestMore: 1,
    requestLess: 2,
    humanCrownAllocation: 4,
    allocation: [
      "Allocate £4 to each Crown Presidency with an open home port.",
      "Allocate £1 to each Presidency with a Crown Writer.",
      "Allocate £3 to the Director of Trade or Governor General.",
    ],
  },
  lion: {
    debt: "Advance once for each sea zone with fewer than two ships.",
    requestMore: 2,
    requestLess: 1,
    humanCrownAllocation: 4,
    allocation: [
      "Allocate £5 to Shipping for each Presidency whose sea zone has fewer than two ships.",
      "Allocate £4 to the Crown Presidency with the most ships.",
      "Allocate £3 to the Director of Trade or Governor General.",
      "Allocate £1 to each Presidency with a Crown Writer.",
    ],
  },
  bear: {
    debt: "Advance once for each Presidency where the Crown is Commander or holds a majority of all pieces in its Army box.",
    requestMore: 2,
    requestLess: 1,
    humanCrownAllocation: 4,
    allocation: [
      "Allocate £4 to each Presidency where the Crown has a majority of pieces in the Army box.",
      "Allocate £2 to each Presidency with a Crown Governor.",
      "Allocate £4 to a Crown Governor General.",
      "Allocate £2 to each Presidency with a Crown Writer.",
    ],
  },
  peacock: {
    debt: "Do not advance the Debt marker by default.",
    requestMore: 3,
    requestLess: null,
    humanCrownAllocation: 5,
    allocation: [
      "Allocate £5 to each Presidency where the Crown is Commander or has a majority of Officers.",
      "Allocate £2 to each Presidency with a Crown Governor.",
      "Allocate £5 to a Crown Governor General.",
    ],
  },
};

export const firstAdditionalDebtConsent: Record<ClimateId, number> = {
  bull: 1,
  stag: 2,
  lion: 3,
  bear: 4,
  peacock: 6,
};

export const hiringGuidance = (role: RoleRef) => {
  if (role === "directorOfTrade") {
    return {
      hirer: "Chairman",
      candidates:
        "Any current officeholder except the Chairman or a Governor. If all offices are vacant, any Writer may be hired.",
    };
  }
  if (role === "governorGeneral") {
    return {
      hirer: "Chairman",
      candidates:
        "Any current officeholder except the Chairman, including a Governor. If all offices are vacant, any Writer may be hired.",
    };
  }
  if (role === "managerOfShipping") {
    return { hirer: "Chairman", candidates: "Any Writer." };
  }
  if (role === "militaryAffairs") {
    return {
      hirer: "Chairman",
      candidates:
        "Military Affairs: any Commander; if none, any Officer; if none, any piece in Officers-in-Training. If the physical card has been replaced by Commander in Chief: any Officer, then Officers-in-Training.",
    };
  }
  if (role === "superintendentChina") {
    return { hirer: "Chairman", candidates: "Any Writer." };
  }
  if (role.startsWith("president:")) {
    return {
      hirer: "Director of Trade or Governor General",
      candidates: "Any Writer or Governor associated with this Presidency.",
    };
  }
  return {
    hirer: "Associated President",
    candidates:
      "Any Writer or Officer in the region. A Commander is not an Officer and cannot be promoted to Governor.",
  };
};

export const governorClimateRules: Record<ClimateId, { minimumDice: number; result: string }> = {
  bull: {
    minimumDice: 3,
    result: "Tax: fund the Crown Presidency first, then place any remainder in Company Balance.",
  },
  stag: {
    minimumDice: 2,
    result: "Tax: fund the Crown Presidency first, then place any remainder in Company Balance.",
  },
  lion: { minimumDice: 2, result: "Build a Company ship." },
  bear: { minimumDice: 2, result: "Commission a Regiment." },
  peacock: { minimumDice: 1, result: "Commission a Regiment." },
};

export const commanderClimateRules: Record<
  ClimateId,
  {
    alliance: string;
    target: string;
    nonCompanyDice: number;
    companyDice: number;
    deployAgain: boolean;
    repeatFavor: number | null;
    stopFavor: number | null;
  }
> = {
  bull: {
    alliance: "Do not purchase a Local Alliance by default.",
    target:
      "Home region with closed orders, then associated Company regions with closed orders, then an uncontrolled home region, then eligible adjacent uncontrolled regions.",
    nonCompanyDice: 6,
    companyDice: 2,
    deployAgain: false,
    repeatFavor: 2,
    stopFavor: null,
  },
  stag: {
    alliance: "Do not purchase a Local Alliance by default.",
    target:
      "Home region with closed orders, then associated Company regions with closed orders, then an uncontrolled home region, then eligible adjacent uncontrolled regions.",
    nonCompanyDice: 5,
    companyDice: 3,
    deployAgain: false,
    repeatFavor: 1,
    stopFavor: null,
  },
  lion: {
    alliance:
      "If Army strength is at least 3, attempt to purchase the cheapest affordable Local Alliance with Presidential consent.",
    target:
      "Uncontrolled home region, then eligible adjacent uncontrolled regions, then associated Company regions with closed orders.",
    nonCompanyDice: 4,
    companyDice: 4,
    deployAgain: false,
    repeatFavor: 1,
    stopFavor: null,
  },
  bear: {
    alliance:
      "If Army strength is at least 2, attempt to purchase the most expensive affordable Local Alliance with Presidential consent.",
    target:
      "Uncontrolled home region, then eligible adjacent uncontrolled regions, then associated Company regions with closed orders.",
    nonCompanyDice: 3,
    companyDice: 5,
    deployAgain: true,
    repeatFavor: null,
    stopFavor: 1,
  },
  peacock: {
    alliance:
      "If Army strength is at least 2, attempt to purchase the most expensive affordable Local Alliance with Presidential consent.",
    target:
      "Uncontrolled home region, then eligible adjacent uncontrolled regions, then associated Company regions with closed orders.",
    nonCompanyDice: 2,
    companyDice: 6,
    deployAgain: true,
    repeatFavor: null,
    stopFavor: 1,
  },
};

export const tradeDice: Record<ClimateId, number> = {
  bull: 2,
  stag: 3,
  lion: 4,
  bear: 5,
  peacock: 6,
};
