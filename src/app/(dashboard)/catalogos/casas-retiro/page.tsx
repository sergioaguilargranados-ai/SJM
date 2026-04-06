import { getCasasRetiroCompleto } from "@/app/actions/catalogos";
import CasasRetiroClientView from "./CasasRetiroClientView";

export const dynamic = "force-dynamic";

export default async function CasasRetiroPage() {
  const res = await getCasasRetiroCompleto();
  return <CasasRetiroClientView datos={res.data || []} />;
}
