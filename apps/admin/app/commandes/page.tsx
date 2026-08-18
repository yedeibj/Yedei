import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import AdminShell from "@/components/AdminShell";
import OrderStatusForm from "@/components/OrderStatusForm";

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  en_attente: "bg-[#EEF3FF] text-[#00008B]",
  confirmee: "bg-[#E8F5E9] text-[#006400]",
  expediee: "bg-[#EEF3FF] text-[#00008B]",
  livree: "bg-[#E8F5E9] text-[#006400]",
  annulee: "bg-[#FDECEF] text-[#DC143C]",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("orders")
    .select(
      "id, customer_name, phone, email, address, city, notes, total, status, payment_status, created_at, order_items(product_name, variant_size, variant_label, unit_price, quantity)"
    )
    .order("created_at", { ascending: false });

  if (filtre && filtre !== "toutes") query = query.eq("status", filtre);

  const { data: orders } = await query;

  const statusEntries = Object.entries(STATUS_LABELS);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Commandes</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Paiement à la livraison pour l'instant. Marque "Payé" une fois la livraison encaissée.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-wide">
        
          href="/commandes"
          className={
            !filtre || filtre === "toutes"
              ? "rounded-full bg-[#181715] px-3 py-1.5 text-white"
              : "rounded-full border border-[#D8D3C9] px-3 py-1.5 text-[#181715]"
          }
        >
          Toutes
        </a>
        {statusEntries.map((entry) => {
          const value = entry[0];
          const label = entry[1];
          const isActive = filtre === value;
          const linkHref = "/commandes?filtre=" + value;
          const linkClass = isActive
            ? "rounded-full bg-[#181715] px-3 py-1.5 text-white"
            : "rounded-full border border-[#D8D3C9] px-3 py-1.5 text-[#181715]";
          return (
            <a key={value} href={linkHref} className={linkClass}>
              {label}
            </a>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {(orders ?? []).map((order: any) => (
          <div key={order.id} className="rounded-md border border-[#D8D3C9] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#181715]">
                  {order.customer_name}{" "}
                  <span className="text-xs font-normal text-[#8C8579]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </p>
                <p className="text-xs text-[#8C8579]">
                  {order.phone}{order.email ? " · " + order.email : ""}
                </p>
                <p className="text-xs text-[#8C8579]">
                  {order.address}{order.city ? ", " + order.city : ""}
                </p>
                {order.notes && (
                  <p className="mt-1 text-xs italic text-[#8C8579]">{order.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={"rounded-full px-2 py-1 text-[10px] uppercase tracking-wide " + (STATUS_COLORS[order.status] ?? "")}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className={"rounded-full px-2 py-1 text-[10px] uppercase tracking-wide " + (order.payment_status === "paye" ? "bg-[#E8F5E9] text-[#006400]" : "bg-[#FDECEF] text-[#DC143C]")}>
                  {order.payment_status === "paye" ? "Payé" : "Non payé"}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-1 border-t border-[#F0EDE5] pt-3">
              {(order.order_items ?? []).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs text-[#181715]">
                  <span>
                    {item.product_name}
                    {item.variant_size ? " — " + item.variant_size : ""}
                    {item.variant_label ? " (" + item.variant_label + ")" : ""} × {item.quantity}
                  </span>
                  <span>{(item.unit_price * item.quantity).toLocaleString("fr-FR")} FCFA</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-[#F0EDE5] pt-2 text-sm font-medium text-[#181715]">
                <span>Total</span>
                <span>{Number(order.total).toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>

            <div className="mt-3 border-t border-[#F0EDE5] pt-3">
              <OrderStatusForm orderId={order.id} status={order.status} paymentStatus={order.payment_status} />
            </div>
          </div>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucune commande pour le moment.</p>
        )}
      </div>
    </AdminShell>
  );
}
