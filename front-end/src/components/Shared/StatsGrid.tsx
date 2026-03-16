import StatsCard from "./StatsCard";

export type StatCard = {
  icon: string;
  label: string;
  value?: number;
  change?: string;
  sub?: string;
};

type statsDataPropsType = {
  statsData: StatCard[];
};

export default function StatsGrid({ statsData }: statsDataPropsType) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
