import AmbientBlobs from "./AmbientBlobs";

const services = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
    title: "Веб-дизайн",
    description:
      "Создаём уникальные интерфейсы, которые конвертируют посетителей в клиентов. Современный дизайн с фокусом на UX/UI.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: "Разработка",
    description:
      "Быстрые, безопасные и масштабируемые веб-приложения на современном стеке технологий. От лендингов до сложных платформ.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Продвижение",
    description:
      "SEO-оптимизация, Яндекс Директ и Google Ads. Привлекаем целевой трафик и увеличиваем продажи вашего бизнеса.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"
        />
      </svg>
    ),
    title: "Парсинг данных",
    description:
      "Автоматический сбор и структурирование данных с сайтов, маркетплейсов и API. Мониторинг цен и выгрузки под ваши задачи.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden py-16 md:py-24 bg-[#141414]"
    >
      <AmbientBlobs
        blobs={[
          {
            side: "left",
            vertical: "top-1/4",
            size: "w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72",
            gradient:
              "bg-[linear-gradient(135deg,rgba(59,130,246,0.55),rgba(168,85,247,0.4),rgba(217,70,239,0.3))]",
            delay: "-4s",
          },
          {
            side: "right",
            vertical: "bottom-10",
            size: "w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60",
            gradient:
              "bg-[linear-gradient(135deg,rgba(34,211,238,0.5),rgba(59,130,246,0.4),rgba(168,85,247,0.3))]",
            delay: "-13s",
          },
        ]}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 text-center text-white">
          Наши услуги
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] p-6 sm:p-8 rounded-2xl border border-white/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 text-white">
                {service.icon}
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 text-white">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
