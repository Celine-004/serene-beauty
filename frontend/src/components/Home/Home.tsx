import Navbar from '../Layout/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-porcelain">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading text-deep-twilight mb-6 leading-tight">
            Discover Your Perfect Skincare Routine
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Take our personalized quiz to find products tailored to your unique skin type and concerns. 
            No guesswork, just results.
          </p>
          <a
            href="/quiz"
            className="inline-block bg-deep-twilight px-10 py-4 rounded-lg hover:opacity-90 transition font-medium text-lg"
          >
            Take the Quiz
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-heading text-deep-twilight text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-lavender-veil mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-heading text-deep-twilight">1</span>
              </div>
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Take the Quiz
              </h3>
              <p className="leading-relaxed">
                Answer 7 simple questions about your skin. It only takes 2 minutes to discover your skin type.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-lavender-veil mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-heading text-deep-twilight">2</span>
              </div>
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Get Your Routine
              </h3>
              <p className="leading-relaxed">
                Receive a personalized morning and evening routine with step-by-step instructions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-lavender-veil mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-heading text-deep-twilight">3</span>
              </div>
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Discover Products
              </h3>
              <p className="leading-relaxed">
                Browse curated product recommendations that match your skin type, concerns, and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-heading text-deep-twilight text-center mb-16">
            Why Serene Beauty?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border border-alabaster">
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Personalized for You
              </h3>
              <p className="leading-relaxed">
                No two skin types are the same. Our algorithm considers your unique skin type and concerns 
                to create a routine that actually works for you.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-alabaster">
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Science-Backed Recommendations
              </h3>
              <p className="leading-relaxed">
                Every product recommendation is based on ingredients that are proven to work for your 
                specific skin concerns.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-alabaster">
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Budget-Friendly Options
              </h3>
              <p className="leading-relaxed">
                Filter products by price range. Great skincare doesn't have to break the bank. 
                Find options that fit your budget.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 border border-alabaster">
              <h3 className="text-xl font-heading text-deep-twilight mb-4">
                Simple and Clear
              </h3>
              <p className="leading-relaxed">
                No confusing routines with 12 steps. We keep it simple with clear instructions 
                on what to use and when.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-20 px-4 bg-lavender-veil">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-heading text-deep-twilight mb-6">
            Coming Soon
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto">
            We're constantly improving. Here's what's on the way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-alabaster">
              <h3 className="font-heading text-deep-twilight mb-2">Progress Tracking</h3>
              <p className="text-sm">Track your skin journey and see improvements over time.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-alabaster">
              <h3 className="font-heading text-deep-twilight mb-2">Product Reviews</h3>
              <p className="text-sm">Read and share reviews from people with similar skin types.</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-alabaster">
              <h3 className="font-heading text-deep-twilight mb-2">Routine Reminders</h3>
              <p className="text-sm">Get gentle reminders to stick to your morning and evening routine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-deep-twilight text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-lg mb-10 opacity-90">
            Be the first to use our app and discover your perfect skincare routine. It's free and takes just 2 minutes.
          </p>
          <a
            href="/quiz"
            className="inline-block bg-white text-deep-twilight px-10 py-4 rounded-lg hover:opacity-90 transition font-medium text-lg"
          >
            Start Your Quiz
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 bg-white border-t border-alabaster">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <a href="/" className="hover:text-deep-twilight transition">Home</a>
            <a href="/quiz" className="hover:text-deep-twilight transition">Quiz</a>
            <a href="/dashboard" className="hover:text-deep-twilight transition">Dashboard</a>
          </div>
          <p className="text-sm opacity-70">© 2025 Serene Beauty. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="mailto:support@serenebeauty.com" className="hover:text-deep-twilight transition">Contact</a>
            <a href="/privacy" className="hover:text-deep-twilight transition">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
