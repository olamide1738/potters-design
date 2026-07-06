export function TermsPage() {
  return (
    <div className="shell py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-3 font-display text-4xl font-semibold lg:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-ink/50 dark:text-bone/50">
          Last updated — 2025. These terms govern all purchases made on the Potter&rsquo;s Design website.
        </p>

        <div className="prose-potters mt-12 space-y-10">
          <Section title="1. Orders &amp; Payment">
            <ul>
              <li>All orders are <strong>final once payment has been successfully made</strong>.</li>
              <li><strong>Order cancellations are not permitted</strong> after payment confirmation.</li>
              <li>Prices are listed in the applicable currency and may change without prior notice.</li>
              <li>Customers are solely responsible for confirming measurements using the <strong>size chart</strong> prior to checkout.</li>
              <li>Potter&rsquo;s Design requires a production timeline of <strong>5–10 working days</strong>.</li>
            </ul>
          </Section>

          <Section title="2. Prices &amp; Shipping Fees">
            <ul>
              <li>All product prices listed on the Potter&rsquo;s Design website <strong>exclude shipping fees</strong>.</li>
              <li><strong>All shipping fees are paid entirely by the customer</strong>.</li>
              <li>Shipping is handled by <strong>third-party logistics providers</strong>, and charges are determined based on <strong>delivery location, destination, and courier rates</strong>.</li>
              <li>Potter&rsquo;s Design does not own or directly control third-party shipping charges, delivery timelines, or customs processing; however, we <strong>actively monitor shipments and ensure compliance with standard delivery and handling practices</strong>.</li>
              <li>If delivery is refused, missed, or unsuccessful despite reasonable courier attempts, the item will be returned to Potter&rsquo;s Design and the customer will be charged for any <strong>unpaid duties, taxes, and additional shipping costs</strong>.</li>
            </ul>
          </Section>

          <Section title="3. No Cash Refunds">
            <ul>
              <li>Potter&rsquo;s Design <strong>does not issue cash refunds</strong>.</li>
              <li>Where applicable, approved returns may qualify for <strong>store credit or exchange only</strong>, subject to inspection and compliance with this policy.</li>
            </ul>
          </Section>

          <Section title="4. Returns Eligibility">
            <p>Returns are accepted <strong>strictly at the discretion of Potter&rsquo;s Design</strong> and only if all the following conditions are met:</p>
            <ul>
              <li>The item is <strong>unused, unworn, and unwashed</strong>.</li>
              <li>All <strong>original Potter&rsquo;s Design tags remain attached</strong>, exactly as delivered.</li>
              <li>The item is free from <strong>makeup, deodorant, perfume stains, odors, or any form of damage</strong>.</li>
              <li>The item is returned within <strong>24 hours of delivery (Lagos)</strong> or <strong>72 hours (outside Lagos within Nigeria)</strong>.</li>
              <li>For international returns, items must be received at our store within <strong>7 working days</strong> of receipt.</li>
            </ul>
            <p>Potter&rsquo;s Design reserves the right to <strong>reject any return</strong> that does not meet these conditions.</p>
          </Section>

          <Section title="5. Return Process &amp; Liability">
            <ul>
              <li>All return logistics and shipping costs are <strong>entirely borne by the customer</strong>.</li>
              <li>Items remain the <strong>customer&rsquo;s responsibility until successfully received at our warehouse</strong>.</li>
              <li>Potter&rsquo;s Design is <strong>not liable</strong> for items lost, damaged, delayed, or incorrectly returned during transit.</li>
            </ul>
          </Section>

          <Section title="6. International Orders">
            <ul>
              <li>All <strong>international shipping fees</strong> are <strong>entirely borne by the customer</strong>.</li>
              <li>Customers are responsible for all <strong>import duties, customs charges, and applicable taxes</strong>.</li>
              <li>International shipping fees, duties, and taxes are <strong>non-refundable under any circumstances</strong>.</li>
            </ul>
          </Section>

          <Section title="7. Store Credit &amp; Exchanges">
            <ul>
              <li>Kindly note that we <strong>do not exchange items made to a customer&rsquo;s specific measurements</strong>.</li>
              <li>Where approved, Potter&rsquo;s Design may issue <strong>store credit or offer an exchange</strong>, subject to product availability and the reason for return.</li>
              <li>Store credit is issued <strong>only after inspection and approval</strong> of the returned item.</li>
            </ul>
          </Section>

          <Section title="8. Faulty or Incorrect Items (Our Error)">
            <ul>
              <li>This applies <strong>only where Potter&rsquo;s Design mistakenly delivers a faulty item or an incorrect size</strong>.</li>
              <li>Issues must be reported within <strong>24 hours of delivery</strong>, supported by <strong>clear video evidence</strong>.</li>
              <li>Claims made after <strong>48 hours of receipt</strong> will not be considered.</li>
              <li>Approved claims qualify for <strong>store credit, refund, or exchange</strong>, at Potter&rsquo;s Design&rsquo;s discretion.</li>
            </ul>
          </Section>

          <Section title="9. Sale Items">
            <ul>
              <li><strong>All sale items are final</strong>.</li>
              <li>No returns, exchanges, or store credit will be issued on sale items.</li>
            </ul>
          </Section>

          <Section title="10. Unclaimed / Abandoned Items">
            <ul>
              <li>Items left unclaimed or abandoned for <strong>over three (3) months</strong> will be <strong>donated to charity</strong> without further notice.</li>
            </ul>
          </Section>

          <Section title="11. Modifications">
            <ul>
              <li>Potter&rsquo;s Design reserves the right to <strong>update or modify these Terms &amp; Conditions at any time</strong> without prior notice.</li>
              <li>Continued use of the website constitutes acceptance of any revised terms.</li>
            </ul>
          </Section>

          <div className="rounded-card border border-gold/30 bg-gold/5 px-6 py-5 text-sm dark:bg-gold/10">
            By completing your purchase, you acknowledge that you have read and agreed to these{" "}
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
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2 dark:text-bone/80 dark:[&_strong]:text-bone">
        {children}
      </div>
    </div>
  );
}
