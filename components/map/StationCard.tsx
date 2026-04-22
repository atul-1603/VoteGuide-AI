import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, ShieldAlert, Phone } from "lucide-react";

interface Props {
  stationId: string | null;
}

interface StationDetails {
  name: string;
  address: string;
  booth: string;
  distance: string;
  accessible: boolean;
}

const mockStationDetails: Record<string, StationDetails> = {
  "1": { name: "Govt Primary School", address: "Sector 14, Main Road", booth: "142A", distance: "0.8 km", accessible: true },
  "2": { name: "Community Center", address: "Phase 2, Block B", booth: "143B", distance: "1.2 km", accessible: true },
  "3": { name: "High School Hall", address: "Near Market Square", booth: "145C", distance: "1.5 km", accessible: false },
};

export function StationCard({ stationId }: Props) {
  if (!stationId) {
    return (
      <Card className="bg-card/40 backdrop-blur-md border-white/10 h-full flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-medium text-white mb-2">No Station Selected</h3>
        <p className="text-sm text-muted-foreground">Search for your address or select a marker on the map to view polling station details.</p>
      </Card>
    );
  }

  const station = mockStationDetails[stationId];

  return (
    <Card className="bg-card/60 backdrop-blur-md border-white/10 h-full flex flex-col shadow-xl">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl text-white">{station.name}</CardTitle>
          <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">Booth {station.booth}</span>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {station.address}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pt-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
            <Clock className="w-4 h-4 text-secondary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Polling Hours</p>
              <p className="text-sm font-medium text-white">07:00 AM - 06:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
            <ShieldAlert className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Accessibility</p>
              <p className="text-sm font-medium text-white">{station.accessible ? "Wheelchair Accessible" : "Limited Access"}</p>
            </div>
          </div>
        </div>

        <div className="mt-2 bg-primary/10 border border-primary/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" /> Voter Helpline
          </h4>
          <p className="text-xs text-muted-foreground">Call 1950 for any election-related queries or complaints.</p>
        </div>

        <div className="mt-auto pt-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions ({station.distance})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
