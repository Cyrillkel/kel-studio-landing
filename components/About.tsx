const stats = [
  { value: "50+", label: "Проектов" },
  { value: "5+", label: "Лет опыта" },
  { value: "100%", label: "Качество" },
];

const stack = [
  "React, Next.js",
  "WordPress, Elementor",
  "Node.js, Python, PHP",
  "Tailwind CSS, GSAP, Framer Motion",
  "Figma",
  "PostgreSQL, MongoDB, Redis",
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              О студии
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              KEL Studio - команда профессионалов с опытом более 5 лет в
              создании цифровых продуктов.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Мы специализируемся на разработке веб-сайтов и приложений
              премиум-класса. Наш подход основан на глубоком понимании бизнеса
              клиента и потребностей его аудитории.
            </p>
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1f1f1f] p-12 rounded-2xl border border-white/5">
            <h3 className="text-2xl font-bold mb-6 text-white">Наш стек</h3>
            <div className="space-y-4">
              {stack.map((tech, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-gray-300">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
