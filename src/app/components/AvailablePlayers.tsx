"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import type { Player } from "~/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface AvailablePlayersProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  disabledTeams: Set<string>;
  disabledPositions: Set<string>;
  getConference: (team: string) => string;
}

type SortConfig = {
  key: keyof Player;
  direction: "ascending" | "descending";
};

const AvailablePlayers: React.FC<AvailablePlayersProps> = ({
  players,
  onAddPlayer,
  disabledTeams,
  disabledPositions,
  getConference,
}) => {
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "espnName",
    direction: "ascending",
  });

  const positions = ["QB", "RB", "WR", "TE", "K", "DEF"];
  const teams = Array.from(new Set(players.map((p) => p.team))).sort();

  const sortedPlayers = React.useMemo(() => {
    const sortableItems = [...players];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [players, sortConfig]);

  const filteredPlayers = sortedPlayers.filter(
    (player) =>
      (positionFilter === "all" ||
        player.pos === positionFilter ||
        (positionFilter === "K" && player.pos === "PK")) &&
      (teamFilter === "all" || player.team === teamFilter),
  );

  const requestSort = (key: keyof Player) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const isPlayerDisabled = (player: Player) => {
    const conference = getConference(player.team);
    const position = player.pos === "PK" ? "K" : player.pos;
    return (
      disabledTeams.has(player.team) ||
      disabledPositions.has(`${conference}-${position}`)
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Available Players</h2>
      <div className="mb-4 flex gap-4">
        <Select onValueChange={setPositionFilter} value={positionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setTeamFilter} value={teamFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {["jerseyNum", "espnName", "team", "pos", "exp", "age"].map(
              (key) => (
                <TableHead key={key}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort(key as keyof Player)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ),
            )}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.map((player) => {
            const isDisabled = isPlayerDisabled(player);
            return (
              <TableRow
                key={`${player.team}-${player.espnName}-${player.pos}`}
                className={isDisabled ? "opacity-50" : ""}
              >
                <TableCell>{player.jerseyNum}</TableCell>
                <TableCell>{player.espnName}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.pos}</TableCell>
                <TableCell>{player.exp}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onAddPlayer(player)}
                    disabled={isDisabled}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AvailablePlayers;
