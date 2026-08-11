interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
  textColor: string;
}

export default function StatCard({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
