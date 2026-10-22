import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from 'react'

type MedicationOption = {
  id: string
  name: string
  schedule: string
}

type Props = {
  medication: MedicationOption
  options: MedicationOption[]
  onClose: () => void
}

const states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'.split('|')

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  optional?: boolean
}

function InputField({ label, optional = false, ...props }: InputFieldProps) {
  return <label className="callback-field">
    <span className="callback-label">{label} {optional && <span className="font-normal text-[#7c887e]">(optional)</span>}</span>
    <input {...props} className="callback-input" />
  </label>
}

function CallbackDialog({ medication, options, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [payment, setPayment] = useState('')
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    dialog?.querySelector<HTMLInputElement>('[name="fullName"]')?.focus({ preventScroll: true })
    return () => { if (dialog?.open) dialog.close() }
  }, [])

  function close() {
    dialogRef.current?.close()
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const phone = form.elements.namedItem('phone') as HTMLInputElement
    const street = form.elements.namedItem('street') as HTMLInputElement
    const digits = phone.value.replace(/\D/g, '')
    if (digits.length !== 10) {
      phone.setCustomValidity('Enter a 10-digit U.S. phone number.')
      phone.reportValidity()
      return
    }
    if (/\bp\.?\s*o\.?\s*box\b|\bpost\s+office\s+box\b/i.test(street.value)) {
      street.setCustomValidity('Enter a street address rather than a P.O. box.')
      street.reportValidity()
      return
    }
    setComplete(true)
  }

  return <dialog
    ref={dialogRef}
    className="callback-dialog"
    aria-labelledby="callback-heading"
    onCancel={(event) => { event.preventDefault(); close() }}
    onClick={(event) => { if (event.target === event.currentTarget) close() }}
  >
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e5e8e1] bg-[#fffdfa] px-5 py-4 sm:px-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#315943]">The East Journal · Demo call back</p>
        <h2 id="callback-heading" className="mt-1 font-serif text-[22px] leading-tight">Request a call from a pharmacist</h2>
        <p className="mt-1 text-xs text-[#69766c]">About {medication.name} · {medication.schedule}</p>
      </div>
      <button type="button" onClick={close} className="grid size-8 shrink-0 place-items-center rounded-md text-2xl leading-none text-[#5c675f] hover:bg-[#edf0ea]" aria-label="Close form">×</button>
    </div>

    {complete ? <div className="px-6 py-10 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e3efe4] text-xl font-semibold text-[#28513a]">✓</div>
      <h3 className="mt-5 font-serif text-2xl">Demo request complete</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#59675d]">This was a preview of the call-back process. Your details were not sent or stored, and no one will call.</p>
      <button type="button" onClick={close} className="callback-primary mt-7">Done</button>
    </div> : <form onSubmit={handleSubmit} onInput={(event) => {
      if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('')
    }} className="px-5 py-5 sm:px-6">
      <p className="mb-5 rounded-md bg-[#edf3ec] px-3 py-2 text-xs leading-relaxed text-[#3b5a45]">Interactive demo only. This form does not send or store information, and no call will be made.</p>

      <label className="callback-field">
        <span className="callback-label">Medication</span>
        <select name="medication" defaultValue={medication.id} required className="callback-input">
          {options.map((item) => <option value={item.id} key={item.id}>{item.name} ({item.schedule})</option>)}
          <option value="general">General question / not listed</option>
        </select>
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InputField name="fullName" label="Full name" autoComplete="name" required />
        <InputField name="phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 123-4567" required />
        <InputField name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <label className="callback-field"><span className="callback-label">Best time to call (ET)</span><select name="time" required defaultValue="" className="callback-input"><option value="" disabled>Select</option><option value="morning">Morning, 9am–12pm</option><option value="afternoon">Afternoon, 12–5pm</option><option value="evening">Evening, 5–8pm</option></select></label>
      </div>

      <fieldset className="callback-group">
        <legend>Delivery address</legend>
        <InputField name="street" label="Street address" autoComplete="address-line1" placeholder="123 Main St" required />
        <div className="mt-3"><InputField name="unit" label="Apt, suite, unit" optional autoComplete="address-line2" /></div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_1fr_.8fr]">
          <InputField name="city" label="City" autoComplete="address-level2" required />
          <label className="callback-field"><span className="callback-label">State</span><select name="state" defaultValue="" autoComplete="address-level1" required className="callback-input"><option value="" disabled>Select</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
          <InputField name="zip" label="ZIP code" autoComplete="postal-code" inputMode="numeric" placeholder="10001" pattern="[0-9]{5}(-?[0-9]{4})?" title="Enter a five-digit ZIP code, optionally followed by four digits." required />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[#69766c]">Controlled medications may require an adult signature, so use a street address rather than a P.O. box.</p>
      </fieldset>

      <fieldset className="callback-group">
        <legend>Payment preference</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="callback-field"><span className="callback-label">Mode of payment</span><select name="payment" value={payment} onChange={(event) => setPayment(event.target.value)} required className="callback-input"><option value="" disabled>Select</option><option>Credit card</option><option>Debit card</option><option>HSA / FSA card</option><option>Bank transfer (ACH)</option><option>Insurance + copay</option></select></label>
          <InputField name="bank" label="Bank name" optional={payment === 'Insurance + copay'} placeholder="e.g. Chase" required={payment !== 'Insurance + copay'} list="callback-banks" />
          <datalist id="callback-banks"><option value="Bank of America" /><option value="Chase" /><option value="Wells Fargo" /><option value="Citibank" /><option value="Capital One" /><option value="U.S. Bank" /><option value="PNC" /><option value="Truist" /><option value="TD Bank" /></datalist>
        </div>
        <p className="callback-hint mt-3">Never enter card or account numbers in this form. In a real pharmacy, payment should use a secure process after prescription verification.</p>
      </fieldset>

      <label className="callback-field mt-4"><span className="callback-label">Do you have a prescription?</span><select name="prescription" defaultValue="" required className="callback-input"><option value="" disabled>Select</option><option>Yes, from my prescriber</option><option>My prescriber will send it electronically</option><option>Not yet, I have a question</option></select></label>
      <p className="callback-hint mt-3">Please do not include symptoms or medical history in a call-back form.</p>

      <div className="mt-5 space-y-3">
        <label className="callback-check"><input type="checkbox" required /><span>I’m 18 or older and I’m asking about my own prescription.</span></label>
        <label className="callback-check"><input type="checkbox" required /><span>I understand this is a demo form. No information will be submitted and no call will be made.</span></label>
      </div>
      <p className="mt-5 text-[11px] font-medium text-[#8e633a]">Demo only · No information is sent or stored.</p>
      <div className="mt-4 flex justify-end gap-2 border-t border-[#e5e8e1] pt-4"><button type="button" onClick={close} className="callback-secondary">Cancel</button><button type="submit" className="callback-primary">Request call back</button></div>
    </form>}
  </dialog>
}

export default CallbackDialog
