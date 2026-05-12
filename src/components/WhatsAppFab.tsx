import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi THREADBYKAY, I'd like to ask about a piece.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.65_0.16_150)] text-white shadow-elegant transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M19.11 17.43c-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.34-.8-.71-1.34-1.6-1.5-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.61-1.47-.83-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.47.07-.71.34-.25.27-.93.91-.93 2.22s.95 2.58 1.08 2.76c.13.18 1.86 2.84 4.5 3.98.63.27 1.13.43 1.51.55.63.2 1.21.17 1.66.1.51-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.31zM16.04 5.33C10.13 5.33 5.33 10.12 5.33 16c0 1.88.49 3.71 1.43 5.33L5.33 26.67l5.49-1.43A10.6 10.6 0 0 0 16.04 26.67c5.91 0 10.71-4.79 10.71-10.67S21.95 5.33 16.04 5.33z"/>
      </svg>
    </a>
  );
}
