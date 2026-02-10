export function FooterCTA() {
    return (
        <footer className="py-24 text-center border-t border-neutral-200">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900">Stop letting busywork eat your profits.</h2>
                <button className="px-8 py-4 bg-gradient-to-r from-[#ff9900] to-[#ff3300] text-white font-bold text-lg rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5">
                    Book Your Free Automation Audit
                </button>
                <p className="mt-12 text-sm text-neutral-500">© {new Date().getFullYear()} Amplyfy. All rights reserved.</p>
            </div>
        </footer>
    );
}
