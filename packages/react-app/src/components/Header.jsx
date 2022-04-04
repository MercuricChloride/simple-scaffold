import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" rel="noopener noreferrer">
      <PageHeader
        title="Blind Scaffold-ETH"
        subTitle="A starterkit for my personal buidls (inspired and forked from @ghostffcode)"
        className="inline-flex"
      />
    </a>
  );
}
