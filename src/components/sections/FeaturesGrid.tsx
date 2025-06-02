import { FeatureCard } from "@/components/ui/FeatureCard";

export const FeaturesGrid = () => {
  const features = [
    {
      title: "List of domains",
      description:
        "See the entire list of data sources we use to check the availability of domain names for you.",
      isDark: false,
    },
    {
      title: "List of domains",
      description:
        "See the entire list of data sources we use to check the availability of domain names for you.",
      isDark: true,
    },
    {
      title: "List of domains",
      description:
        "See the entire list of data sources we use to check the availability of domain names for you.",
      isDark: true,
    },
    {
      title: "List of domains",
      description:
        "See the entire list of data sources we use to check the availability of domain names for you.",
      isDark: false,
    },
  ];

  return (
    <section className="self-center w-[1243px] max-w-full mt-[69px] grid grid-cols-1 md:grid-cols-2 gap-5">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          isDark={feature.isDark}
        />
      ))}
    </section>
  );
};
