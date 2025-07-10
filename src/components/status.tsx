const Status = ({ color, value }: { color?: string; value: string }) => {
  const statusColor = color
    ? color
    : value === "success"
    ? "#21C239"
    : value === "failed"
    ? "#F23737"
    : "#FFAA00";

  return (
    <div className="flex items-center gap-1 flex-[1] justify-center">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: statusColor }}
      ></span>
      <span
        className=" capitalize font-semibold"
        style={{ color: statusColor }}
      >
        {value}
      </span>
    </div>
  );
};

export default Status;
