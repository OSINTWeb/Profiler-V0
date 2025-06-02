interface FeatureCardProps {
  title: string;
  description: string;
  isDark?: boolean;
}

export const FeatureCard = ({
  title,
  description,
  isDark = false,
}: FeatureCardProps) => {
  const bgColor = isDark ? "bg-[rgba(63,63,63,1)]" : "bg-[rgba(169,169,169,1)]";
  const textColor = isDark ? "text-white" : "text-[rgba(26,26,26,1)]";

  return (
    <div
      className={`${bgColor} flex flex-col items-center ${textColor} pt-[35px] pb-[55px] px-20 rounded-3xl`}
    >
      <div className="flex w-[307px] max-w-full flex-col items-center">
        <h3 className="text-[28px] font-extrabold leading-[1.4]">{title}</h3>
        <p className="text-xs font-normal leading-[17px] text-center mt-[47px]">
          {description}
        </p>
        <button className="bg-white w-[136px] text-base text-black font-medium leading-[1.2] mt-[207px] px-[25px] py-3 rounded-[48px]">
          Check Now
        </button>
      </div>
    </div>
  );
};
