import { X, Check } from "lucide-react";

export function PainSolution() {
    return (
        <section className="flex flex-col md:flex-row min-h-screen">
            {/* Pain - Left */}
            <div className="flex-1 bg-neutral-50 p-12 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-200">
                <h3 className="text-3xl font-bold text-red-500 mb-8">The Manual Trap</h3>
                <ul className="space-y-6">
                    <li className="flex items-start gap-4 text-neutral-600">
                        <X className="w-6 h-6 text-red-500 shrink-0" />
                        <span>10+ Browser tabs open juggling tools</span>
                    </li>
                    <li className="flex items-start gap-4 text-neutral-600">
                        <X className="w-6 h-6 text-red-500 shrink-0" />
                        <span>Copy-pasting data between spreadsheets</span>
                    </li>
                    <li className="flex items-start gap-4 text-neutral-600">
                        <X className="w-6 h-6 text-red-500 shrink-0" />
                        <span>Leads sitting cold for hours</span>
                    </li>
                </ul>
            </div>

            {/* Solution - Right */}
            <div className="flex-1 bg-white p-12 md:p-24 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff9900]/5 to-[#ff3300]/5" />
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff9900] to-[#ff3300] mb-8 relative z-10">The Automated Engine</h3>
                <ul className="space-y-6 relative z-10">
                    <li className="flex items-start gap-4 text-neutral-900">
                        <Check className="w-6 h-6 text-[#ff5500] shrink-0" />
                        <span>Unified dashboard for all metrics</span>
                    </li>
                    <li className="flex items-start gap-4 text-neutral-900">
                        <Check className="w-6 h-6 text-[#ff5500] shrink-0" />
                        <span>Instant bi-directional data sync</span>
                    </li>
                    <li className="flex items-start gap-4 text-neutral-900">
                        <Check className="w-6 h-6 text-[#ff5500] shrink-0" />
                        <span>24/7 AI Lead Nurture & Scheduling</span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
