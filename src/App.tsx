import { useEffect, useState } from 'react'

type Medication = { id: string; name: string; brand: string; schedule: 'C-II' | 'C-III' | 'C-IV' | 'C-V'; use: string; note: string }
const medicines: Medication[] = [
  { id: 'amph-salts', name: 'Amphetamine / Dextroamphetamine', brand: 'Generic for Adderall', schedule: 'C-II', use: 'ADHD', note: 'A stimulant that can affect heart rate and blood pressure. Use only as prescribed.' },
  { id: 'methylphenidate-er', name: 'Methylphenidate ER', brand: 'Generic for Concerta', schedule: 'C-II', use: 'ADHD', note: 'An extended-release stimulant. Follow the specific product instructions.' },
  { id: 'oxycodone-apap', name: 'Oxycodone / Acetaminophen', brand: 'Generic for Percocet', schedule: 'C-II', use: 'Pain', note: 'An opioid combination. Ask about naloxone and total acetaminophen intake.' },
  { id: 'hydrocodone-apap', name: 'Hydrocodone / Acetaminophen', brand: 'Generic for Norco', schedule: 'C-II', use: 'Pain', note: 'An opioid combination. Alcohol and other sedating drugs can increase risk.' },
  { id: 'bup-nal', name: 'Buprenorphine / Naloxone', brand: 'Generic for Suboxone', schedule: 'C-III', use: 'Opioid use disorder', note: 'A treatment used as part of care for opioid use disorder.' },
  { id: 'testosterone-cyp', name: 'Testosterone Cypionate', brand: 'Generic for Depo-Testosterone', schedule: 'C-III', use: 'Hormone therapy', note: 'An injectable hormone treatment that requires clinician monitoring.' },
  { id: 'alprazolam', name: 'Alprazolam', brand: 'Generic for Xanax', schedule: 'C-IV', use: 'Anxiety', note: 'A benzodiazepine. Combining it with opioids or alcohol can be dangerous.' },
  { id: 'clonazepam', name: 'Clonazepam', brand: 'Generic for Klonopin', schedule: 'C-IV', use: 'Anxiety / seizures', note: 'May cause drowsiness. Ask a clinician before changing or stopping treatment.' },
  { id: 'lorazepam', name: 'Lorazepam', brand: 'Generic for Ativan', schedule: 'C-IV', use: 'Anxiety', note: 'Can impair alertness. Follow your prescriber’s directions carefully.' },
  { id: 'zolpidem', name: 'Zolpidem', brand: 'Generic for Ambien', schedule: 'C-IV', use: 'Insomnia', note: 'A sleep medicine with important next-day alertness and behavior warnings.' },
  { id: 'modafinil', name: 'Modafinil', brand: 'Generic for Provigil', schedule: 'C-IV', use: 'Sleep disorders', note: 'Discuss possible interactions, including hormonal contraception, with your clinician.' },
  { id: 'tramadol', name: 'Tramadol', brand: 'Generic for Ultram', schedule: 'C-IV', use: 'Pain', note: 'An opioid with interaction risks. Review all medicines with a pharmacist.' },
  { id: 'pregabalin', name: 'Pregabalin', brand: 'Generic for Lyrica', schedule: 'C-V', use: 'Nerve pain', note: 'Can cause dizziness or drowsiness, especially with other sedating drugs.' },
  { id: 'lacosamide', name: 'Lacosamide', brand: 'Generic for Vimpat', schedule: 'C-V', use: 'Seizures', note: 'An antiseizure medicine. Do not change treatment without medical guidance.' },
]

const sources = [
  ['FDA · Considering an Online Pharmacy?', 'https://www.fda.gov/drugs/besaferx-your-source-online-pharmacy-information/considering-online-pharmacy'],
  ['FDA · BeSafeRx frequently asked questions', 'https://www.fda.gov/drugs/besaferx-your-source-online-pharmacy-information/besaferx-frequently-asked-questions-faqs'],
  ['FDA · Locate a state-licensed online pharmacy', 'https://www.fda.gov/drugs/besaferx-your-source-online-pharmacy-information/locate-state-licensed-online-pharmacy'],
  ['NABP · Find safe online pharmacies', 'https://safe.pharmacy/buy-safely/'],
  ['DEA · Drug scheduling', 'https://www.dea.gov/drug-information/drug-scheduling'],
  ['eCFR · Controlled substances regulations', 'https://www.ecfr.gov/current/title-21/chapter-II/part-1304'],
]

const links = [['Safety signs', '#signs'], ['Schedules', '#schedules'], ['Medication guide', '#medications'], ['The process', '#process'], ['Sources', '#sources']]
const filters = ['All', 'C-II', 'C-III', 'C-IV', 'C-V'] as const
type Filter = (typeof filters)[number]

function Arrow({ external = false }: { external?: boolean }) {
  return external
    ? <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 5h6v6m0-6-9 9M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
    : <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
}

function App() {
  const [filter, setFilter] = useState<Filter>('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const remaining = document.documentElement.scrollHeight - innerHeight
      setProgress(remaining > 0 ? scrollY / remaining * 100 : 0)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [])

  const visible = filter === 'All' ? medicines : medicines.filter((med) => med.schedule === filter)

  return <div className="min-h-screen bg-[#f7f8f5] text-[#1c2823]">
    <div className="border-b border-[#dce4db] bg-[#eaf0e9] px-5 py-2.5 text-center text-xs leading-relaxed text-[#3d5849] sm:text-sm">
      Independent patient guide · Educational information only <span className="mx-2 text-[#9baa9d]">/</span><a href="#disclosure" className="font-semibold underline underline-offset-2">Read our disclosure</a>
    </div>
    <header className="sticky top-0 z-30 border-b border-[#e4e8e1] bg-[#f7f8f5]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
        <a href="#top" className="group flex shrink-0 items-center gap-3" aria-label="The East Journal, back to top">
          <span className="grid size-9 place-items-center rounded-full border border-[#315943] font-serif text-lg font-semibold text-[#315943] transition-colors group-hover:bg-[#315943] group-hover:text-white">E</span>
          <span className="flex flex-col leading-none"><span className="text-[17px] font-semibold tracking-[-.045em] sm:text-[19px]">THE EAST JOURNAL</span><span className="mt-1 text-[9px] font-semibold uppercase tracking-[.27em] text-[#738176]">A clearer look at care</span></span>
        </a>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Sections">{links.map(([label, href]) => <a key={href} href={href} className="text-[13px] font-medium text-[#55655a] hover:text-[#1d5038]">{label}</a>)}</nav>
        <div className="flex items-center gap-3"><a href="#signs" className="hidden items-center gap-2 rounded-full bg-[#234b38] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#173726] sm:inline-flex">Read the guide <Arrow /></a><button type="button" className="grid size-10 place-items-center rounded-full border border-[#d9e1d8] xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? 'Close menu' : 'Open menu'}><span className="text-xl">{menuOpen ? '×' : '☰'}</span></button></div>
      </div>
      {menuOpen && <nav id="mobile-nav" aria-label="Mobile sections" className="border-t border-[#e4e8e1] bg-[#f7f8f5] px-5 py-3 xl:hidden">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#e4e8e1] py-3 text-sm font-medium last:border-0">{label}</a>)}</nav>}
      <div className="h-[2px]" aria-hidden="true"><div className="h-full bg-[#537d5e]" style={{ width: progress + '%' }} /></div>
    </header>

    <main id="top">
      <section className="mx-auto grid max-w-[1360px] gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-14 lg:px-12 lg:pb-24 lg:pt-20">
        <div>
          <p className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-[#41664e]" /> Health literacy / 01</p>
          <h1 className="max-w-[760px] font-serif text-[clamp(3.35rem,6vw,6.7rem)] leading-[.98] tracking-[-.065em]">Know the pharmacy <em className="font-normal text-[#4a7154]">before</em> you trust the prescription.</h1>
          <p className="mt-8 max-w-xl text-[17px] leading-[1.7] text-[#53635a] sm:text-[19px]">A practical guide to buying controlled medications online: how to spot a licensed pharmacy, understand drug schedules, and know what a legitimate order involves.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5"><a href="#signs" className="inline-flex items-center gap-3 rounded-full bg-[#234b38] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#173726]">Explore the safety guide <Arrow /></a><span className="text-xs font-medium uppercase tracking-[.17em] text-[#748176]">9 minute read</span></div>
          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#dce4db] pt-5 text-xs text-[#68776d]"><span>By The East Journal editorial team</span><span>•</span><time dateTime="2026-10-21">October 21, 2026</time><span>•</span><span>U.S. patient guide</span></div>
        </div>
        <figure className="relative"><div className="overflow-hidden bg-[#d8ded4]"><img src="/images/patient-phone.webp" alt="Illustration of a person reviewing a prescription while using a phone" className="h-[440px] w-full object-cover sm:h-[570px] lg:h-[650px]" /></div><figcaption className="mt-3 text-xs leading-relaxed text-[#7a877d]">Illustrative image. A prescription image may begin an enquiry; the pharmacy must still follow applicable verification rules.</figcaption><div className="absolute -left-4 bottom-14 hidden max-w-[230px] border border-[#dbe4da] bg-[#f7f8f5] p-5 shadow-xl sm:block lg:-left-10"><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#52745a]">The guiding question</span><p className="mt-3 font-serif text-[22px] leading-[1.2]">Is this pharmacy actually licensed?</p></div></figure>
      </section>

      <section className="border-y border-[#dde5db] bg-[#eef2eb]"><div className="mx-auto grid max-w-[1360px] gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1fr_1.5fr] md:items-center lg:px-12"><p className="font-serif text-2xl leading-snug tracking-[-.025em] sm:text-3xl">Online convenience should come with <em>real safeguards.</em></p><p className="max-w-2xl text-[15px] leading-[1.8] text-[#4e6153]">The FDA estimates that roughly 35,000 online pharmacies are active at any given time, while only about 5% comply with U.S. pharmacy laws and practice standards. That makes verification the first step, before price or convenience. <a href={sources[1][1]} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">FDA source ↗</a></p></div></section>

      <section id="signs" className="scroll-mt-28 mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div><p className="eyebrow">01 / Safety signs</p><h2 className="section-title">A safer pharmacy leaves a trail you can check.</h2><p className="section-intro">Use the FDA’s criteria to assess a site before sharing health or payment information.</p><a href={sources[2][1]} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-[#234b38] pb-1 text-sm font-semibold text-[#234b38]">Find a state-licensed pharmacy <Arrow external /></a></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[#d3e2d5] bg-[#e8f0e8] p-7 sm:p-8"><div className="mb-7 grid size-10 place-items-center rounded-full bg-[#c8ddcc] text-[#234b38]">✓</div><h3 className="font-serif text-2xl">Signs to look for</h3><ul className="mt-5 list-disc space-y-4 pl-5 text-[14px] leading-[1.6] text-[#405247]"><li>Requires a valid prescription from a doctor</li><li>Lists a physical U.S. address and phone number</li><li>Has a licensed pharmacist available to answer questions</li><li>Is licensed with a state board of pharmacy</li></ul></div>
            <div className="border border-[#eadbd6] bg-[#f4ebe7] p-7 sm:p-8"><div className="mb-7 grid size-10 place-items-center rounded-full bg-[#ebd6cd] text-[#8a4c38]">!</div><h3 className="font-serif text-2xl">Reasons to pause</h3><ul className="mt-5 list-disc space-y-4 pl-5 text-[14px] leading-[1.6] text-[#594b44]"><li>No prescription required</li><li>No verifiable U.S. or state license</li><li>Prices that seem too good to be true</li><li>Unusual, damaged, foreign-language, or expired packaging</li><li>Unclear privacy and financial protections</li></ul></div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 border-l-[3px] border-[#467255] bg-white px-6 py-6 sm:grid-cols-[170px_1fr] sm:gap-8"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#3a6548]">For controlled substances</p><p className="text-sm leading-[1.75] text-[#4d5d51]">U.S. online pharmacies dispensing controlled substances have additional federal disclosure requirements. Check the site’s DEA information and confirm its license through official records. Requirements can vary by state. <a href={sources[5][1]} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Read the regulation ↗</a></p></div>
      </section>

      <section id="schedules" className="scroll-mt-28 bg-[#1e3027] py-20 text-white lg:py-24"><div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 grid gap-4 md:grid-cols-2 md:items-end"><div><p className="eyebrow !text-[#a9c7ad]">02 / Drug schedules</p><h2 className="section-title !text-white">What the schedule tells you.</h2></div><p className="max-w-lg text-[15px] leading-[1.75] text-[#c1d0c3]">The DEA groups controlled substances by accepted medical use and potential for misuse or dependence. Schedule I substances are not prescribed under federal law; this guide focuses on Schedules II through V.</p></div>
        <div className="overflow-x-auto border-t border-[#6c806f]"><table className="w-full min-w-[680px] border-collapse text-left text-sm"><thead><tr className="text-xs uppercase tracking-[.16em] text-[#a9c7ad]"><th className="w-32 py-5 pr-6 font-semibold">Schedule</th><th className="w-[35%] py-5 pr-6 font-semibold">DEA classification</th><th className="py-5 font-semibold">Prescription takeaway</th></tr></thead><tbody className="text-[#e0e9df]">
          <tr className="border-t border-[#526659]"><td className="py-6 pr-6 align-top"><span className="schedule-badge">C-II</span></td><td className="py-6 pr-8 align-top">High potential for misuse and severe dependence</td><td className="py-6 align-top">Federal law does not permit refills. A valid prescription must come through an accepted legal channel.</td></tr>
          <tr className="border-t border-[#526659]"><td className="py-6 pr-6 align-top"><span className="schedule-badge">C-III</span></td><td className="py-6 pr-8 align-top">Moderate to low potential for physical or psychological dependence</td><td className="py-6 align-top">Federal rules generally allow up to five refills within six months.</td></tr>
          <tr className="border-t border-[#526659]"><td className="py-6 pr-6 align-top"><span className="schedule-badge">C-IV</span></td><td className="py-6 pr-8 align-top">Low potential for misuse relative to Schedule III</td><td className="py-6 align-top">Federal rules generally allow up to five refills within six months.</td></tr>
          <tr className="border-y border-[#526659]"><td className="py-6 pr-6 align-top"><span className="schedule-badge">C-V</span></td><td className="py-6 pr-8 align-top">Lower potential for misuse relative to Schedule IV</td><td className="py-6 align-top">Refills follow the prescriber’s authorization and applicable state rules.</td></tr>
        </tbody></table></div><p className="mt-5 text-xs leading-relaxed text-[#a9b9aa]">General federal overview. State laws and product-specific rules may be stricter. <a href={sources[4][1]} target="_blank" rel="noreferrer" className="underline underline-offset-2">DEA drug scheduling ↗</a></p>
      </div></section>

      <section id="medications" className="scroll-mt-28 mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="grid gap-4 md:grid-cols-[1fr_.7fr] md:items-end"><div><p className="eyebrow">03 / Medication guide</p><h2 className="section-title">Explore medicines by schedule.</h2></div><p className="max-w-lg text-sm leading-[1.75] text-[#58675c]">Examples of commonly discussed controlled medications. These descriptions are general, and every one requires a valid prescription. A clinician or pharmacist can explain the risks for your situation.</p></div>
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter medications by schedule">{filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ' + (filter === item ? 'border-[#234b38] bg-[#234b38] text-white' : 'border-[#d8e1d8] bg-white text-[#4b5d50] hover:border-[#234b38]')}>{item === 'All' ? 'All medicines (' + medicines.length + ')' : 'Schedule ' + item.slice(2)}</button>)}</div>
        <p className="mt-4 text-xs text-[#78877b]" aria-live="polite">Showing {visible.length} {visible.length === 1 ? 'medicine' : 'medicines'}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((med) => <article key={med.id} className="group flex flex-col overflow-hidden border border-[#e0e7de] bg-white"><div className="aspect-[4/3] overflow-hidden bg-[#e9e9e3]"><img src={'/images/' + med.id + '.webp'} alt={'Illustrative packaging for ' + med.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" /></div><div className="flex flex-1 flex-col p-5"><div className="mb-4 flex items-center justify-between gap-2"><span className="rounded-full bg-[#e9f0e8] px-2.5 py-1 text-[10px] font-bold tracking-[.1em] text-[#305440]">{med.schedule}</span><span className="text-right text-[11px] text-[#748177]">{med.use}</span></div><h3 className="font-serif text-[21px] leading-[1.15] tracking-[-.02em]">{med.name}</h3><p className="mt-1 text-xs text-[#819087]">{med.brand}</p><p className="mt-4 border-t border-[#e7ebe5] pt-4 text-[13px] leading-[1.65] text-[#536157]">{med.note}</p></div></article>)}</div>
        <p className="mt-6 text-xs leading-relaxed text-[#77877b]">Images show illustrative, unbranded packaging; they are not product identifiers. Never use a photograph to identify a medicine.</p>
      </section>

      <section id="process" className="scroll-mt-28 border-y border-[#e1e8de] bg-white py-20 lg:py-28"><div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="mb-11 grid gap-5 md:grid-cols-[.8fr_1fr] md:items-end"><div><p className="eyebrow">04 / The process</p><h2 className="section-title">What a legitimate order involves.</h2></div><p className="max-w-lg text-[15px] leading-[1.75] text-[#58675c]">A photo of a prescription may start a conversation. It does not replace a valid prescription, professional review, and the rules that apply to that medicine and your state.</p></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{[
          ['patient-phone', 'Start with your prescription', 'Share your prescription through the pharmacy’s approved process. Ask how it is transmitted and verified.'],
          ['pharmacist-review', 'A pharmacist reviews it', 'A licensed pharmacist checks the prescription and reviews safety concerns and applicable dispensing rules.'],
          ['doctor-video', 'Your prescriber stays involved', 'Questions about your treatment or unclear directions go back to your prescriber.'],
          ['patient-delivery', 'Receive it securely', 'The pharmacy explains delivery, tracking, packaging, and any signature requirements.'],
        ].map(([image, title, description], index) => <article key={image} className="border-t-2 border-[#315943] pt-4"><div className="mb-5 flex items-center justify-between"><span className="font-serif text-3xl text-[#42664b]">0{index + 1}</span><span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#91a093]">Step {index + 1}</span></div><img src={'/images/' + image + '.webp'} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" /><h3 className="mt-5 font-serif text-[24px] leading-tight">{title}</h3><p className="mt-2 text-sm leading-[1.7] text-[#5a6a5e]">{description}</p></article>)}</div>
      </div></section>

      <section className="mx-auto grid max-w-[1360px] gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20 lg:px-12 lg:py-28"><div><p className="eyebrow">A final safety note</p><h2 className="section-title">Care continues after the order.</h2><p className="section-intro">Treat controlled medicines with the same caution at home that you used when choosing a pharmacy.</p><img src="/images/hero-pharmacist.webp" alt="Illustrative portrait of a pharmacist" loading="lazy" className="mt-8 h-[320px] w-full object-cover object-top" /></div><div className="divide-y divide-[#dce5dc] border-y border-[#dce5dc]">{[
        ['Know your interactions', 'Ask a pharmacist about alcohol, opioids, benzodiazepines, and other medicines that may make your prescription less safe.'],
        ['Store medicines securely', 'Keep controlled medications in a secure place away from children, visitors, and pets.'],
        ['Dispose of unused medicine', 'Use an authorized medicine take-back location or another disposal method recommended by the FDA or DEA.'],
        ['Never share a prescription', 'A pill that looks familiar can still be counterfeit. Only take medicine dispensed for you through a licensed pharmacy.'],
      ].map(([title, description], index) => <div key={title} className="grid gap-3 py-6 sm:grid-cols-[52px_1fr]"><span className="font-serif text-xl text-[#729177]">0{index + 1}</span><div><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 max-w-xl text-sm leading-[1.75] text-[#5b6b5f]">{description}</p></div></div>)}<p className="py-6 text-xs leading-[1.7] text-[#6a796d]">In the U.S., call 911 for a suspected overdose. For mental health or substance use crisis support, call or text 988.</p></div></section>

      <section id="sources" className="scroll-mt-28 border-t border-[#e0e7de] bg-[#eef2eb] py-20 lg:py-24"><div className="mx-auto grid max-w-[1360px] gap-10 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20 lg:px-12"><div><p className="eyebrow">05 / Further reading</p><h2 className="section-title">Check the source.</h2><p className="section-intro">These public resources explain the safety and regulatory guidance behind this article.</p></div><ol className="border-t border-[#cbd9cc]">{sources.map(([label, url], index) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 border-b border-[#cbd9cc] py-5 text-sm font-medium text-[#264735] hover:text-[#4a7655]"><span className="w-7 shrink-0 text-xs text-[#829687]">0{index + 1}</span><span className="flex-1">{label}</span><Arrow external /></a></li>)}</ol></div></section>

      <section id="disclosure" className="scroll-mt-28 mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:px-12"><div className="grid gap-6 border-l-[3px] border-[#9caa91] bg-white p-7 sm:p-9 md:grid-cols-[200px_1fr]"><div><p className="eyebrow !mb-2">Transparency</p><h2 className="font-serif text-3xl">Disclosure</h2></div><div className="space-y-3 text-sm leading-[1.8] text-[#58675c]"><p>The East Journal is an independent educational concept adapted from the structure of <a href="https://ast-journal.pplx.app/" target="_blank" rel="noreferrer" className="underline underline-offset-2">The Ast Journal demo</a>. It is not affiliated with Ast Pharmacy, and it does not sell, dispense, or arrange prescriptions.</p><p>Images are illustrative AI-generated images from the reference demo. This guide is general U.S. information, not medical or legal advice. Always follow your prescriber’s and pharmacist’s instructions and verify current state requirements.</p></div></div></section>
    </main>

    <footer className="bg-[#1e3027] px-5 py-10 text-white sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1360px] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><a href="#top" className="font-serif text-2xl tracking-[-.04em]">The East Journal</a><p className="mt-2 text-xs text-[#b2c2b4]">A clearer look at care. General information only.</p></div><div className="flex gap-5 text-xs text-[#c2cfc3]"><a href="#sources" className="hover:text-white">Sources</a><a href="#disclosure" className="hover:text-white">Disclosure</a><a href="#top" className="hover:text-white">Back to top ↑</a></div></div></footer>
  </div>
}

export default App
