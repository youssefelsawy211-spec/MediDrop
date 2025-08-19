import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Search, Upload, Globe, DollarSign, FileText, ShieldCheck, BadgeCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MediDropPro() {
  // ---------------- State ----------------
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [rxForItem, setRxForItem] = useState(null as null | { name: string });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"unverified" | "pending" | "verified">("unverified");

  // ---------------- Mock Data ----------------
  const sellers = {
    PharmaPlus: { verified: true, country: "EG" },
    "MediCare Egypt": { verified: true, country: "EG" },
    "Global Health": { verified: false, country: "AE" },
  } as const;

  const products = [
    { name: "Vitamin C 1000mg", desc: "Boosts immunity.", price: "$12", seller: "PharmaPlus", tags: ["OTC"], rx: false, image: "https://via.placeholder.com/300x180" },
    { name: "Paracetamol 500mg", desc: "Pain & fever relief.", price: "$5", seller: "MediCare Egypt", tags: ["OTC"], rx: false, image: "https://via.placeholder.com/300x180" },
    { name: "Insulin Pen (Analog)", desc: "Prescription required. Cold-chain.", price: "$35", seller: "Global Health", tags: ["Rx", "Cold-Chain"], rx: true, image: "https://via.placeholder.com/300x180" },
  ];

  const earningsData = [
    { month: "Mar", earnings: 2400 },
    { month: "Apr", earnings: 2000 },
    { month: "May", earnings: 3000 },
    { month: "Jun", earnings: 3600 },
    { month: "Jul", earnings: 4100 },
    { month: "Aug", earnings: 4700 },
  ];

  // ---------------- Handlers ----------------
  function handleAddToCart(p: any) {
    if (p.rx) {
      setRxForItem({ name: p.name });
      setRxModalOpen(true);
      return;
    }
    toast.success(`${p.name} added to cart`);
  }

  async function handleLicenseVerify() {
    setVerifyLoading(true);
    setVerifyStatus("pending");
    // Mock API delay & decision
    await new Promise((r) => setTimeout(r, 1400));
    setVerifyLoading(false);
    setVerifyStatus("verified");
    toast.success("Pharmacy license verified. Seller is now Verified.");
  }

  // ---------------- Filters ----------------
  const visibleProducts = products.filter((p) =>
    verifiedOnly ? sellers[p.seller as keyof typeof sellers]?.verified : true
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-600">MediDrop Pro</h1>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Trusted Medicines Marketplace</span>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search medicines, supplements..." className="w-64" />
          <Button variant="outline"><Search className="w-4 h-4" /></Button>
          <Button className="ml-4 bg-green-600 hover:bg-green-700 text-white">
            <Upload className="w-4 h-4 mr-2" /> Upload Product
          </Button>
        </div>
      </header>

      <Tabs defaultValue="marketplace">
        <TabsList className="mb-6 flex flex-wrap gap-2">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="dashboard">Seller Dashboard</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Center</TabsTrigger>
          <TabsTrigger value="verification">Pharmacy Verification</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="catalog">Country Rules</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>

        {/* Marketplace */}
        <TabsContent value="marketplace">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Browse verified pharmacies & compliant products.</p>
            <div className="flex items-center gap-2">
              <Checkbox id="chkVerified" checked={verifiedOnly} onCheckedChange={(v:any)=>setVerifiedOnly(!!v)} />
              <Label htmlFor="chkVerified" className="cursor-pointer text-sm">Show verified sellers only</Label>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleProducts.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: i * 0.12 }}>
                <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
                  <img src={p.image} alt={p.name} className="rounded-t-2xl w-full h-40 object-cover" />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      {sellers[p.seller as keyof typeof sellers]?.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><BadgeCheck className="w-3 h-3"/> Verified</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{p.desc}</p>
                    <p className="text-xs text-gray-400 mb-2">Seller: {p.seller}</p>
                    <div className="flex gap-2 mb-2">
                      {p.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">{p.price}</span>
                      <Button size="sm" onClick={() => handleAddToCart(p)}>
                        {p.rx ? "Upload Rx to Buy" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>
        </TabsContent>

        {/* Seller Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Earnings Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" /><YAxis /><Tooltip />
                  <Line type="monotone" dataKey="earnings" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Recent Orders</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>#1027 – Vitamin C – $12 – Delivered</li>
                <li>#1026 – Paracetamol – $15 – Processing</li>
                <li>#1025 – Insulin Pen – $35 – Awaiting Rx</li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Center */}
        <TabsContent value="compliance">
          <Card className="p-6 space-y-2">
            <h3 className="font-semibold text-lg">Compliance & Safety</h3>
            <p className="text-sm text-gray-600">• Upload required licenses, enable prescription gate for Rx medicines, enforce cold-chain for temperature-sensitive items.</p>
            <p className="text-sm text-gray-600">• Listings auto-pause when licenses expire; buyers must upload valid Rx before checkout.</p>
          </Card>
        </TabsContent>

        {/* Verification (Pharmacy KYC) */}
        <TabsContent value="verification">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Pharmacy Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Pharmacy / Business Name</Label>
                  <Input placeholder="e.g., Al Shifa Pharmacy" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input placeholder="EG / AE / SA / IQ / EU" />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input placeholder="e.g., EDA-XXXXXX" />
                </div>
                <div>
                  <Label>Tax/VAT Number</Label>
                  <Input placeholder="Optional" />
                </div>
                <div>
                  <Label>Upload License (PDF/Image)</Label>
                  <Input type="file" />
                </div>
                <div>
                  <Label>Pharmacist ID (Front/Back)</Label>
                  <Input type="file" multiple />
                </div>
              </div>
              <Button onClick={handleLicenseVerify} disabled={verifyLoading || verifyStatus === "verified"} className="w-full">
                {verifyLoading ? (<span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Verifying…</span>) : verifyStatus === "verified" ? (<span className="inline-flex items-center gap-2"><BadgeCheck className="w-4 h-4"/> Verified</span>) : "Submit for Verification"}
              </Button>
              <div className="text-xs text-gray-500">API placeholder: auto-check with EDA / DHA / SFDA registries. If no API, route to manual review.</div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">Audit & Auto‑Pause Rules</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Daily license re-check; listings paused 30 days before expiry.</li>
                <li>Country mismatch triggers manual review.</li>
                <li>Random sample order checks for Rx authenticity.</li>
              </ul>
              <div className="border rounded-xl p-3 text-xs text-gray-600">
                <div>08/10 – License EDA-123456 validated ✅</div>
                <div>08/14 – Seller address matched MOH registry ✅</div>
                <div>08/19 – Insulin listing paused (awaiting Rx policy update) ⏸</div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Payouts */}
        <TabsContent value="payouts">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Payouts & Reconciliation</h3>
            <p className="text-gray-600 text-sm mb-2">COD reconciled weekly; bank transfer within 2 business days. Platform fee 5%.</p>
            <Button variant="outline" className="mt-2"><FileText className="w-4 h-4 mr-2" /> Download Invoice</Button>
          </Card>
        </TabsContent>

        {/* Catalog Rules */}
        <TabsContent value="catalog">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center"><Globe className="w-4 h-4 mr-2" /> Multi‑Country Catalog Rules</h3>
            <p className="text-gray-600 text-sm mb-2">Egypt: Paracetamol – OTC; Insulin – Rx + Cold‑Chain.</p>
            <p className="text-gray-600 text-sm mb-2">UAE: Vitamin C – OTC; Antibiotics – Rx.</p>
            <p className="text-gray-600 text-sm">EU: Strict Rx; all cold‑chain tracked with data loggers.</p>
          </Card>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language">
          <Card className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-4">🌍 Language Settings</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline">English</Button>
              <Button variant="outline" className="rtl">العربية (RTL)</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rx Upload Modal */}
      {rxModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4 z-50" onClick={() => setRxModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full md:max-w-xl p-6" onClick={(e)=>e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Upload Prescription</h3>
            <p className="text-sm text-gray-600 mb-4">To purchase <span className="font-medium">{rxForItem?.name}</span>, upload a valid doctor’s prescription. Your order will be reviewed before shipping.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Patient Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div>
                <Label>Doctor Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div className="md:col-span-2">
                <Label>Upload Prescription</Label>
                <Input type="file" />
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea placeholder="Optional details" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={()=>setRxModalOpen(false)}>Cancel</Button>
              <Button onClick={()=>{ setRxModalOpen(false); toast.success("Prescription attached. Item added to cart."); }}>Submit & Add to Cart</Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 text-sm">
        © 2025 MediDrop Pro. Built for compliant medicine dropshipping.
      </footer>
    </div>
  );
}
