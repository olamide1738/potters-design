export function TermsPage() {
  return (
    <div className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-semibold lg:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-bone/70">
          These Terms &amp; Conditions govern all purchases made on the Potter&rsquo;s Design website. By placing an
          order, you confirm that you have read, understood, and agreed to the terms outlined below.
        </p>

        <div className="prose-potters mt-12 space-y-10">
          <Section title="1. ORDERS & PAYMENT">
            <ul>
              <li>All orders are <strong>final once payment has been successfully made</strong>.</li>
              <li><strong>Order cancellations are not permitted</strong> after payment confirmation.</li>
              <li>Prices are listed in the applicable currency and may change without prior notice.</li>
              <li>Customers are solely responsible for confirming measurements using the <strong>size chart</strong> prior to checkout.</li>
              <li>Potter&rsquo;s Design requires a production timeline of <strong>5–10 working days</strong>.</li>
            </ul>
          </Section>

          <Section title="2. PRICES & SHIPPING FEES">
            <ul>
              <li>All product prices listed on the Potter&rsquo;s Design website <strong>exclude shipping fees</strong>.</li>
              <li><strong>All shipping fees are paid entirely by the customer</strong>.</li>
              <li>Shipping is handled by <strong>third-party logistics providers</strong>, and charges are determined based on delivery location, destination, and courier rates.</li>
              <li>Potter&rsquo;s Design does not own or directly control third-party shipping charges, delivery timelines, or customs processing; however, we <strong>actively monitor shipments and ensure compliance with standard delivery and handling practices</strong>.</li>
              <li>If delivery is refused, missed, or unsuccessful despite reasonable courier attempts, the item will be returned to Potter&rsquo;s Design and the customer will be charged for any <strong>unpaid duties, taxes, and additional shipping costs</strong>.</li>
            </ul>
          </Section>

          <Section title="3. NO CASH REFUNDS">
            <ul>
              <li>Potter&rsquo;s Design <strong>does not issue cash refunds</strong>.</li>
              <li>Where applicable, approved returns may qualify for <strong>store credit or exchange only</strong>, subject to inspection and compliance with this policy.</li>
            </ul>
          </Section>

          <Section title="4. RETURNS ELIGIBILITY">
            <p>Returns are accepted <strong>strictly at the discretion of Potter&rsquo;s Design</strong> and only if all the following conditions are met:</p>
            <ul>
              <li>The item is <strong>unused, unworn, and unwashed</strong>.</li>
              <li>All original Potter&rsquo;s Design <strong>tags remain attached</strong>, exactly as delivered.</li>
              <li>The item is free from <strong>makeup, deodorant, perfume stains, odors, or any form of damage</strong>.</li>
              <li>The item is returned within <strong>24 hours of delivery (Lagos)</strong> or <strong>72 hours (outside Lagos within Nigeria)</strong>.</li>
              <li>For international returns, items must be received at our store within <strong>7 working days of receipt</strong>.</li>
            </ul>
            <p>Potter&rsquo;s Design reserves the right to <strong>reject any return</strong> that does not meet these conditions.</p>
          </Section>

          <Section title="5. RETURN PROCESS & LIABILITY">
            <ul>
              <li>All return logistics and shipping costs are <strong>entirely borne by the customer</strong>.</li>
              <li>Items remain the <strong>customer&rsquo;s responsibility until successfully received at our warehouse</strong>.</li>
              <li>Potter&rsquo;s Design is <strong>not liable for items lost, damaged, delayed, or incorrectly returned</strong> during transit.</li>
            </ul>
          </Section>

          <Section title="6. INTERNATIONAL ORDERS">
            <ul>
              <li>All <strong>international shipping fees are entirely borne by the customer</strong>.</li>
              <li>Customers are responsible for all <strong>import duties, customs charges, and applicable taxes</strong>.</li>
              <li>International shipping fees, duties, and taxes are <strong>non-refundable under any circumstances</strong>.</li>
            </ul>
          </Section>

          <Section title="7. STORE CREDIT & EXCHANGES">
            <ul>
              <li>Kindly note that we <strong>do not exchange items made to a customer&rsquo;s specific measurements</strong>.</li>
              <li>Where approved, Potter&rsquo;s Design may issue <strong>store credit or offer an exchange</strong>, subject to product availability and the reason for return.</li>
              <li>Store credit is issued <strong>only after inspection and approval</strong> of the returned item.</li>
            </ul>
          </Section>

          <Section title="8. FAULTY OR INCORRECT ITEMS (OUR ERROR)">
            <ul>
              <li>This applies <strong>only where Potter&rsquo;s Design mistakenly delivers a faulty item or an incorrect size</strong>.</li>
              <li>Issues must be reported within <strong>24 hours of delivery</strong>, supported by <strong>clear video evidence</strong>.</li>
              <li>Claims made after <strong>48 hours of receipt</strong> will not be considered.</li>
              <li>Approved claims may qualify for a <strong>replacement, store credit, exchange, or refund</strong>, at Potter&rsquo;s Design&rsquo;s discretion.</li>
            </ul>
          </Section>

          <Section title="9. SALE ITEMS">
            <ul>
              <li><strong>All sale items are final</strong>.</li>
              <li><strong>No returns, exchanges, store credit, or refunds</strong> will be issued on sale items.</li>
            </ul>
          </Section>

          <Section title="10. UNCLAIMED / ABANDONED ITEMS">
            <ul>
              <li>Items left unclaimed or abandoned for <strong>more than three (3) months</strong> will be <strong>donated to charity</strong> without further notice.</li>
            </ul>
          </Section>

          <Section title="11. MODIFICATIONS">
            <ul>
              <li>Potter&rsquo;s Design reserves the right to <strong>update or modify these Terms &amp; Conditions at any time</strong> without prior notice.</li>
              <li>Continued use of the website constitutes acceptance of any revised terms.</li>
            </ul>
          </Section>

          <div className="rounded-card border border-gold/30 bg-gold/5 px-6 py-5 text-sm font-medium dark:bg-gold/10">
            <span className="mb-1 block font-bold uppercase tracking-wider text-gold">Acceptance of Terms</span>
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
