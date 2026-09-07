import { GearForm } from "@/components/gear-form";

export default function NewGearPage() {
  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Add gear</h1>
          <p className="text-body">List a new item for customers to rent.</p>
        </div>
      </div>
      <GearForm />
    </div>
  );
}
