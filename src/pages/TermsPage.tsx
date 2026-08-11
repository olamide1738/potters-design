export function TermsPage() {
  return (
    <div className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-semibold lg:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-bone/70">
          These Terms &amp; Conditions govern all purchases made through the Potter&rsquo;s Design website. By placing an order, you
          acknowledge that you have read, understood, and agreed to these Terms &amp; Conditions.
        </p>

        <div className="prose-potters mt-12 space-y-10">
          <Section title="1. ORDERS & PAYMENT">
            <ul>
              <li>All orders are <strong>confirmed once payment has been successfully received</strong>.</li>
              <li>
                Orders may only be cancelled within <strong>24 hours of payment</strong> provided production has not commenced and materials
                have not been allocated or specially procured for the order. Once production has commenced, cancellation is at
                Potter&rsquo;s Design&rsquo;s sole discretion. Approved cancellations within this period will attract a <strong>10% administrative fee</strong>,
                which will be deducted from the refund amount.
              </li>
              <li>
                Cancellation requests made after 24 hours of payment will only be considered in accordance with our <strong>Refund &amp; Exchange Policy</strong>.
              </li>
              <li>All prices are listed in the applicable currency and are subject to change without prior notice.</li>
              <li>
                Customers are solely responsible for selecting the correct size using the <strong>Potter&rsquo;s Design Size Guide</strong> before placing
                an order. Potter&rsquo;s Design shall not be liable for fitting issues arising from inaccurate measurements supplied by the
                customer.
              </li>
              <li>
                Our standard production timeline is <strong>5–10 working days</strong>, excluding weekends and public holidays. However
                production timelines are estimates only and may vary depending on order volume, material availability and
                unforeseen circumstances.
              </li>
              <li>Size differences of up to <strong>1–2 inches</strong> resulting from handcrafted garment production shall not be considered defects.</li>
              <li>
                Product colours may vary slightly due to lighting, photography, screen resolution and fabric dye lots. Such
                variations shall not constitute a defect.
              </li>
            </ul>
          </Section>

          <Section title="2. PRICES & SHIPPING">
            <ul>
              <li>All prices displayed <strong>exclude shipping fees</strong>.</li>
              <li>Shipping costs are <strong>borne entirely by the customer</strong>.</li>
              <li>Shipping is handled by <strong>independent third-party courier services</strong>.</li>
              <li>Potter&rsquo;s Design is <strong>not responsible for delays</strong> caused by customs authorities, import inspections or government agencies.</li>
              <li>Refused or unsuccessful deliveries may incur additional shipping, customs and redelivery charges payable by the customer.</li>
              <li>
                Potter&rsquo;s Design reserves the right to deduct any shipping, storage, customs, administrative or handling costs
                incurred before any refund or store credit is processed.
              </li>
            </ul>
          </Section>

          <Section title="3. REFUND & EXCHANGE POLICY">
            <ul>
              <li>Approved claims may qualify for a <strong>refund, store credit, or exchange</strong>, subject to inspection and approval.</li>
              <li>Custom-made garments made to customer&rsquo;s specific measurements are <strong>non-refundable and non-exchangeable</strong>.</li>
              <li>Eligible returns may qualify for an <strong>exchange or store credit</strong> depending on the nature of the claim.</li>
              <li>Defective or incorrect items must be reported within <strong>24 hours with a clear unedited video</strong>.</li>
              <li>Returned items must be <strong>received, inspected and approved</strong>.</li>
              <li>Claims made after <strong>48 hours (Lagos)</strong> or <strong>72 hours (outside Lagos)</strong> will not be considered.</li>
            </ul>
          </Section>

          <Section title="4. RETURN ELIGIBILITY">
            <ul>
              <li>Item must be <strong>unused, unworn and unwashed</strong>.</li>
              <li>Original tags must <strong>remain attached</strong>.</li>
              <li>Item must be <strong>free from stains, odours, alterations or damage</strong>.</li>
              <li>
                Any alteration, repair or modification carried out by the customer or a third party <strong>automatically voids eligibility</strong>
                for refunds, exchanges or store credit.
              </li>
              <li>Return request must be made within <strong>24 hours of delivery</strong>.</li>
              <li>Return within <strong>24 hours (Lagos)</strong> or <strong>72 hours (outside Lagos)</strong>.</li>
              <li>International returns must be dispatched to Potter&rsquo;s Design warehouse within <strong>10 business days</strong>.</li>
              <li>
                Acceptance of the item upon delivery without reporting defects within the stated period shall constitute
                acceptance that the goods were delivered in satisfactory condition.
              </li>
              <li>All returns are <strong>subject to inspection and approval</strong>.</li>
            </ul>
          </Section>

          <Section title="5. RETURN PROCESS & LIABILITY">
            <ul>
              <li>Customers <strong>bear all return shipping costs</strong>.</li>
              <li>Items remain <strong>customer&rsquo;s responsibility until received</strong>.</li>
              <li>Potter&rsquo;s Design is <strong>not liable</strong> for items lost or damaged during return transit.</li>
            </ul>
          </Section>

          <Section title="6. INTERNATIONAL ORDERS">
            <ul>
              <li>Customer pays all <strong>international shipping fees, duties, VAT and taxes</strong>.</li>
              <li>These charges are <strong>non-refundable</strong>.</li>
            </ul>
          </Section>

          <Section title="7. SALE ITEMS">
            <ul>
              <li><strong>All sale items are final sale</strong>.</li>
              <li><strong>No refunds, exchanges or store credit</strong>.</li>
            </ul>
          </Section>

          <Section title="8. UNCLAIMED / ABANDONED ORDERS">
            <ul>
              <li>Orders unclaimed for <strong>more than three months</strong> may be donated or disposed of without prior notice.</li>
            </ul>
          </Section>

          <Section title="9. MODIFICATIONS">
            <ul>
              <li>Potter&rsquo;s Design may <strong>amend these Terms at any time</strong>.</li>
              <li>Continued use constitutes acceptance.</li>
              <li>
                Potter&rsquo;s Design shall <strong>not be liable for delays or failure to perform</strong> due to events beyond its reasonable control
                including but not limited to natural disasters, strikes, government actions, pandemics, supply shortages, transport
                disruptions, power outages or acts of God.
              </li>
            </ul>
          </Section>

          <div className="rounded-card border border-gold/30 bg-gold/5 px-6 py-5 text-sm font-medium dark:bg-gold/10">
            <span className="mb-1.5 block font-bold uppercase tracking-wider text-gold">Acceptance of Terms</span>
            <p className="mb-2 text-xs text-ink/70 dark:text-bone/70">
              These Terms shall be governed by the laws of the Federal Republic of Nigeria.
            </p>
            By completing your purchase, you acknowledge that you have read, understood, and agreed to these{" "}
            <strong>Terms &amp; Conditions</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-mist pt-8 dark:border-edge">
      <h2 className="font-display text-xl font-semibold tracking-wide">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2 dark:text-bone/80 dark:[&_strong]:text-bone">
        {children}
      </div>
    </div>
  );
}
