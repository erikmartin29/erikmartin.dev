import type { HOME_QUERYResult } from "@/sanity/sanity.types";

export type ExperienceItem = NonNullable<
  HOME_QUERYResult["experience"]
>[number];

export type ExperienceGroup = {
  company: string;
  companyUrl: string | null | undefined;
  logo: ExperienceItem["logo"];
  roles: ExperienceItem[];
};

function experienceSortDate(job: ExperienceItem): string {
  return job.singleDate ?? job.startDate ?? "";
}

function compareOrder(
  a: number | null | undefined,
  b: number | null | undefined
): number {
  const aOrder = a ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b ?? Number.MAX_SAFE_INTEGER;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return 0;
}

function minOrder(roles: ExperienceItem[]): number {
  return Math.min(...roles.map((r) => r.order ?? Number.MAX_SAFE_INTEGER));
}

/** Groups experience entries by company, ordered by Sanity `order` (then date within a company). */
export function buildExperienceGroups(
  experience: ExperienceItem[] | null | undefined
): ExperienceGroup[] {
  const byCompany = new Map<string, ExperienceGroup>();

  for (const job of experience ?? []) {
    const company = job.company ?? "";
    const existing = byCompany.get(company);
    if (existing) {
      existing.roles.push(job);
      if (job.companyUrl) existing.companyUrl = job.companyUrl;
      if (job.logo) existing.logo = job.logo;
    } else {
      byCompany.set(company, {
        company,
        companyUrl: job.companyUrl,
        logo: job.logo,
        roles: [job],
      });
    }
  }

  const groups = Array.from(byCompany.values());

  groups.sort((a, b) => {
    const orderDiff = minOrder(a.roles) - minOrder(b.roles);
    if (orderDiff !== 0) return orderDiff;
    return a.company.localeCompare(b.company);
  });

  for (const group of groups) {
    group.roles.sort((a, b) => {
      const orderDiff = compareOrder(a.order, b.order);
      if (orderDiff !== 0) return orderDiff;
      return experienceSortDate(b).localeCompare(experienceSortDate(a));
    });
  }

  return groups;
}
