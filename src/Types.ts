export interface JsonType {
  ServerState: {
    Members: MemberType[];
  };
}

export interface MemberType {
  PlayerInfo: {
    Name: string;
  };
  TimePeriodState: {
    TimePeriodList: TimePeriod[];
  };
}

export interface TimePeriod {
  BountyPoints: number;
  CubePoints: number;
  Key: string;
}

export interface SortedMember {
  idx: number;
  name: string;
  cubePoints: number;
  bountyPoints: number;
  totalPoints: number;
}
