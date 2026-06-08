const projects = [
  {
    title: "E-commerce платформа",
    description: "Интернет-магазин с интеграцией платёжных систем",
  },
  {
    title: "Корпоративный сайт",
    description: "Многостраничный сайт для B2B компании",
  },
  {
    title: "SaaS приложение",
    description: "Веб-приложение для управления проектами",
  },
  {
    title: "Лендинг для стартапа",
    description: "Конверсионная посадочная страница",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
          Избранные проекты
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-video bg-[#1f1f1f] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {project.title}
                </h3>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
