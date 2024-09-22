export interface JsonType {
  ServerState: {
    Members: MemberType[];
    State: { Identity: AllianceType };
  };
}

export interface AllianceType {
  Name: string;
  Tag: string;
}

export interface MemberType {
  PlayerInfo: {
    Name: string;
    // The Date when a member joined the Alliance
    TimeCreated: string;
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
  // Date when a member joined the alliance
  timeCreated: string;
}

export interface SupportMe {
  name: string;
  link: string;
  image: string;
}
