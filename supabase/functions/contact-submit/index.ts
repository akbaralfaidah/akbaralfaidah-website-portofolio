// Reference Supabase Edge Function for server-side Turnstile verification + email dispatch.
// Deploy with: supabase functions deploy contact-submit --no-verify-jwt
// Required secrets in Supabase:
//   TURNSTILE_SECRET_KEY=<Cloudflare Turnstile secret>
//   EMAILJS_SERVICE_ID=... (or RESEND_API_KEY)
//   EMAILJS_TEMPLATE_ID=...
//   EMAILJS_PUBLIC_KEY=...
//   EMAILJS_PRIVATE_KEY=...

const ALLOWED_ORIGINS = new Set([
  'https://akbaralfaidah.com',
  'https://www.akbaralfaidah.com'
]);

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://akbaralfaidah.com';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const body = await req.json();
    const { name, email, deadline, message, turnstileToken } = body ?? {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return new Response(JSON.stringify({ error: 'Invalid name' }), { status: 400, headers });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), { status: 400, headers });
    }
    if (!turnstileToken || typeof turnstileToken !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing Turnstile token' }), { status: 400, headers });
    }

    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
    if (!secretKey) {
      return new Response(JSON.stringify({ error: 'Server missing Turnstile secret' }), { status: 500, headers });
    }

    const verifyBody = new URLSearchParams();
    verifyBody.set('secret', secretKey);
    verifyBody.set('response', turnstileToken);
    const clientIp = req.headers.get('cf-connecting-ip');
    if (clientIp) verifyBody.set('remoteip', clientIp);

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyBody
    });
    const verifyJson = await verifyRes.json();

    if (!verifyJson?.success) {
      return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 403, headers });
    }

    const serviceId = Deno.env.get('EMAILJS_SERVICE_ID');
    const templateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
    const publicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
    const privateKey = Deno.env.get('EMAILJS_PRIVATE_KEY');

    const mailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          from_name: name.trim(),
          from_email: email.trim(),
          deadline: deadline || 'Flexible',
          message: message.trim(),
          to_name: 'Akbar Alfaidah'
        }
      })
    });

    if (!mailRes.ok) {
      return new Response(JSON.stringify({ error: 'Email relay error' }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400, headers });
  }
});
