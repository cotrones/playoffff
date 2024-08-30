"use client";

import React, { useState, useMemo } from "react";
import AvailablePlayers from "./AvailablePlayers";
import UserRoster from "./UserRoster";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import type { Player, Team } from "~/lib/data";

interface RosterBuilderProps {
  initialPlayers: Player[];
  initialTeams: Team[];
}

const RosterBuilder: React.FC<RosterBuilderProps> = ({
  initialPlayers,
  initialTeams,
}) => {
  const [availablePlayers, setAvailablePlayers] =
    useState<Player[]>(initialPlayers);
  const [teams] = useState<Team[]>(initialTeams);
  const [roster, setRoster] = useState<Record<string, Player | null>>({
    "AFC-QB": null,
    "AFC-RB": null,
    "AFC-WR1": null,
    "AFC-WR2": null,
    "AFC-TE": null,
    "AFC-K": null,
    "AFC-DEF": null,
    "NFC-QB": null,
    "NFC-RB": null,
    "NFC-WR1": null,
    "NFC-WR2": null,
    "NFC-TE": null,
    "NFC-K": null,
    "NFC-DEF": null,
    FLEX: null,
  });

  const getConference = (team: string) => {
    return teams.find((t) => t.teamAbv === team)?.conferenceAbv ?? "";
  };

  const disabledTeams = useMemo(() => {
    const teamSet = new Set<string>();
    Object.entries(roster).forEach(([key, player]) => {
      if (player && key !== "FLEX") {
        teamSet.add(player.team);
      }
    });
    return teamSet;
  }, [roster]);

  const disabledPositions = useMemo(() => {
    const posSet = new Set<string>();
    const afcWRCount = [roster["AFC-WR1"], roster["AFC-WR2"]].filter(
      Boolean,
    ).length;
    const nfcWRCount = [roster["NFC-WR1"], roster["NFC-WR2"]].filter(
      Boolean,
    ).length;

    Object.entries(roster).forEach(([key, player]) => {
      if (player && key !== "FLEX") {
        const [conf, pos] = key.split("-");
        posSet.add(`${conf}-${pos}`);
      }
    });

    if (afcWRCount >= 2) posSet.add("AFC-WR");
    if (nfcWRCount >= 2) posSet.add("NFC-WR");

    return posSet;
  }, [roster]);

  const addPlayer = (player: Player) => {
    const conference = getConference(player.team);
    const position = player.pos === "PK" ? "K" : player.pos;

    setRoster((prev) => {
      const newRoster = { ...prev };

      if (position === "WR") {
        const wr1Key = `${conference}-WR1`;
        const wr2Key = `${conference}-WR2`;
        if (newRoster[wr1Key] === null) {
          newRoster[wr1Key] = player;
        } else if (newRoster[wr2Key] === null) {
          newRoster[wr2Key] = player;
        } else if (newRoster.FLEX === null) {
          newRoster.FLEX = player;
        } else {
          alert("No available slot for this wide receiver");
          return prev;
        }
      } else {
        const key = `${conference}-${position}`;
        if (newRoster[key] === null) {
          newRoster[key] = player;
        } else if (newRoster.FLEX === null) {
          newRoster.FLEX = player;
        } else {
          alert("No available slot for this player");
          return prev;
        }
      }

      setAvailablePlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.espnName !== player.espnName),
      );
      return newRoster;
    });
  };

  const removePlayer = (key: string) => {
    setRoster((prev) => {
      const player = prev[key];
      if (player) {
        setAvailablePlayers((prevPlayers) => {
          if (!prevPlayers.some((p) => p.espnName === player.espnName)) {
            return [...prevPlayers, player];
          }
          return prevPlayers;
        });
      }
      return { ...prev, [key]: null };
    });
  };

  const resetRoster = () => {
    setRoster({
      "AFC-QB": null,
      "AFC-RB": null,
      "AFC-WR1": null,
      "AFC-WR2": null,
      "AFC-TE": null,
      "AFC-K": null,
      "AFC-DEF": null,
      "NFC-QB": null,
      "NFC-RB": null,
      "NFC-WR1": null,
      "NFC-WR2": null,
      "NFC-TE": null,
      "NFC-K": null,
      "NFC-DEF": null,
      FLEX: null,
    });
    setAvailablePlayers(initialPlayers);
  };

  const isRosterComplete = Object.values(roster).every(
    (player) => player !== null,
  );
  const filledPositions = Object.values(roster).filter(
    (player) => player !== null,
  ).length;
  const totalPositions = Object.keys(roster).length;

  return (
    <div>
      <div className="mb-4">
        <Alert>
          <AlertTitle>Roster Status</AlertTitle>
          <AlertDescription>
            {isRosterComplete ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                Your roster is complete!
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <XCircle className="mr-2" />
                Your roster is incomplete. {filledPositions}/{totalPositions}{" "}
                positions filled.
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
      <UserRoster roster={roster} onRemovePlayer={removePlayer} />
      <div className="my-4">
        <Button onClick={resetRoster} variant="destructive">
          Reset Roster
        </Button>
      </div>
      <AvailablePlayers
        players={availablePlayers}
        onAddPlayer={addPlayer}
        disabledTeams={disabledTeams}
        disabledPositions={disabledPositions}
        getConference={getConference}
      />
    </div>
  );
};

export default RosterBuilder;
