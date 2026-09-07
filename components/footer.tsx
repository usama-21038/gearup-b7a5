import Link from "next/link";
import { MountainIcon } from "./icons";

export function Footer() {
  return (
    <div className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 12 }}>
              <div className="logo-mark">
                <MountainIcon />
              </div>
              GearUp
            </div>
            <p className="text-small" style={{ maxWidth: 220 }}>
              Rent sports and outdoor gear instantly from local providers you can trust.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="/gear">Browse gear</Link>
            <Link href="/auth/register">Become a provider</Link>
            <Link href="/#how-it-works">How it works</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link href="/">Help center</Link>
            <Link href="/">Cancellations</Link>
            <Link href="/">Contact us</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/">About</Link>
            <Link href="/">Careers</Link>
            <Link href="/">Trust & safety</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GearUp, Inc. All rights reserved.</span>
          <span>Instagram · TikTok · X</span>
        </div>
      </div>
    </div>
  );
}
