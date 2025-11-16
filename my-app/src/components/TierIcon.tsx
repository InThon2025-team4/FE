// Tier icon component with shield design
export const TierIcon = ({
  tier,
  size = 24,
}: {
  tier: string;
  size?: number;
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "BRONZE":
        return "#CD7F32"; // Bronze
      case "SILVER":
        return "#C0C0C0"; // Silver
      case "GOLD":
        return "#FFD700"; // Gold
      case "PLATINUM":
        return "#B9F2FF"; // Platinum
      case "DIAMOND":
        return "#E0115F"; // Diamond
      default:
        return "#FFD700";
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z"
        fill={getTierColor(tier)}
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
