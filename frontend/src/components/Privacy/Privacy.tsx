import Navbar from '../Layout/Navbar'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-heading text-deep-twilight mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg border border-alabaster p-6 space-y-6">
          <p className="opacity-80">
            Last updated: March 2026
          </p>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Information We Collect</h2>
            <p className="leading-relaxed">
              When you use Serene Beauty, we collect information you provide directly, including your 
              quiz responses (skin type, concerns), account information (name, email, username), and 
              any feedback you submit through our contact form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use your information to provide personalized skincare recommendations, save your 
              routines and preferences, improve our services, and respond to your inquiries. We do 
              not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Analytics</h2>
            <p className="leading-relaxed">
              We use Google Analytics to understand how visitors interact with our website. This 
              service collects anonymous usage data such as pages visited, time spent on site, and 
              general location. You can opt out of Google Analytics by installing the 
              <a 
                href="https://tools.google.com/dlpage/gaoptout" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-deep-twilight hover:underline ml-1"
              >
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data, including 
              encrypted connections (HTTPS), secure password hashing, and protected authentication 
              tokens. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Your Rights</h2>
            <p className="leading-relaxed">
              You can access, update, or delete your account information at any time through your 
              profile settings. If you wish to delete your account entirely, you can do so from 
              the "Danger Zone" section in your profile, which will permanently remove all your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Cookies</h2>
            <p className="leading-relaxed">
              We use essential cookies to keep you logged in and remember your preferences. 
              Third-party analytics cookies may also be used to collect anonymous usage statistics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-deep-twilight mb-3">Contact</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy, please 
              <a href="/contact" className="text-deep-twilight hover:underline ml-1">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
