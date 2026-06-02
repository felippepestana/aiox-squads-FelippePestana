export default {
  async fetch(request, env) {
    return new Response(
      "AIOX Chatbot — CLI service, run locally via Docker.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  },
};
