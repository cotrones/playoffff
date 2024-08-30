import React from "react";
import type { Player } from "~/lib/data";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

interface UserRosterProps {
  roster: Record<string, Player | null>;
  onRemovePlayer: (position: string) => void;
}

const UserRoster: React.FC<UserRosterProps> = ({ roster, onRemovePlayer }) => {
  const conferences = ["AFC", "NFC"];
  const positions = [
    { key: "QB", label: "QB" },
    { key: "RB", label: "RB" },
    { key: "WR1", label: "WR" },
    { key: "WR2", label: "WR" },
    { key: "TE", label: "TE" },
    { key: "DEF", label: "DEF" },
    { key: "K", label: "K" },
  ];

  const renderPlayer = (player: Player | null | undefined, key: string) => {
    if (!player) return <span className="text-gray-500">Empty</span>;

    return (
      <div className="flex items-center gap-2">
        <Image
          src={player.espnHeadshot}
          alt={player.espnName}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{player.espnName}</span>
        <span className="text-sm text-gray-500">({player.team})</span>
        <Button size="sm" variant="ghost" onClick={() => onRemovePlayer(key)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Your Roster</h2>
      <div className="flex gap-8">
        {conferences.map((conf) => (
          <div key={conf} className="flex-1">
            <h3 className="mb-2 text-xl font-semibold">{conf}</h3>
            {positions.map(({ key, label }) => {
              const rosterKey = `${conf}-${key}`;
              return (
                <div key={rosterKey} className="mb-2 rounded border p-2">
                  <h4>{label}</h4>
                  {renderPlayer(roster[rosterKey], rosterKey)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="mb-2 text-xl font-semibold">Flex</h3>
        <div className="rounded border p-2">
          {renderPlayer(roster.FLEX, "FLEX")}
        </div>
      </div>
    </div>
  );
};

export default UserRoster;
