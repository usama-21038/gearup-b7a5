import Link from "next/link";
import type { RentalOrder } from "@/lib/types";
import { fmtCurrency, fmtDateShort } from "@/lib/utils";
import { StatusBadge } from "./badges";
import { BoxIcon, CategoryIcon, categoryTintClass } from "./icons";

export function CustomerOrdersTable({ orders }: { orders: RentalOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="state-block">
        <div className="state-icon">
          <BoxIcon size={20} />
        </div>
        <h3>No orders yet</h3>
        <p>Once you rent gear, your orders will show up here.</p>
        <Link href="/gear" className="btn btn-primary btn-sm">
          Browse gear
        </Link>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Gear</th>
            <th>Rental dates</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const firstItem = o.items[0];
            const gearName = o.items.length > 1 ? `${firstItem?.gearItem.name} + ${o.items.length - 1} more` : firstItem?.gearItem.name || "Gear item";
            const category = firstItem?.gearItem.category.name || "Cycling";
            return (
              <tr key={o.id}>
                <td>
                  <div className="row-flex">
                    <div className={`mini-thumb ${categoryTintClass(category)}`}>
                      <CategoryIcon category={category} size={18} />
                    </div>
                    <div>
                      <div className="cell-primary">{gearName}</div>
                      <div className="cell-sub">{o.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {fmtDateShort(o.startDate)} – {fmtDateShort(o.endDate)}
                </td>
                <td className="cell-primary">{fmtCurrency(o.totalAmount)}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td style={{ textAlign: "right" }}>
                  {o.status === "CONFIRMED" ? (
                    <Link href={`/dashboard/customer/orders/${o.id}/pay`} className="btn btn-primary btn-sm">
                      Pay now
                    </Link>
                  ) : (
                    <Link href={`/dashboard/customer/orders/${o.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
