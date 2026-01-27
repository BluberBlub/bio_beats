import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

interface Props {
    items: FAQItem[];
}

const categories = ['All', 'General', 'For Artists', 'For Bookers', 'Pricing', 'Platform'];

export default function FAQSection({ items }: Props) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filteredItems = activeCategory === 'All'
        ? items
        : items.filter(item => item.category === activeCategory);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => {
                    const count = category === 'All'
                        ? items.length
                        : items.filter(i => i.category === category).length;

                    return (
                        <button
                            key={category}
                            onClick={() => { setActiveCategory(category); setOpenIndex(null); }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeCategory === category
                                    ? 'bg-[#ff0700] text-white'
                                    : 'bg-[#262626] text-[#a3a3a3] hover:text-white hover:bg-[#404040]'
                                }`}
                        >
                            {category} ({count})
                        </button>
                    );
                })}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
                {filteredItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#171717] border border-[#262626] rounded-xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-[#262626]/50 transition-colors"
                        >
                            <span className="font-medium text-white pr-4">{item.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-[#ff0700] flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-[#737373] flex-shrink-0" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-6">
                                <div className="pt-2 border-t border-[#262626]">
                                    <p className="text-[#a3a3a3] leading-relaxed pt-4">{item.answer}</p>
                                    <span className="inline-block mt-4 px-3 py-1 bg-[#262626] rounded-full text-xs text-[#737373]">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-[#a3a3a3]">No FAQs found in this category.</p>
                </div>
            )}
        </div>
    );
}
