import {at, defineMigration, patch, set} from 'sanity/migrate'

type ExperienceDoc = {
  _id: string
  company?: string
  startDate?: string
  singleDate?: string
}

function sortDate(doc: ExperienceDoc): string {
  return doc.singleDate ?? doc.startDate ?? ''
}

export default defineMigration({
  title: 'Seed experience display order from current date-based ordering',
  async *migrate(documents) {
    const docs: ExperienceDoc[] = []
    for await (const doc of documents()) {
      if (doc._type !== 'experience' || doc.order != null) continue
      docs.push(doc as ExperienceDoc)
    }

    docs.sort((a, b) => sortDate(b).localeCompare(sortDate(a)))

    const companyOrder: string[] = []
    const byCompany = new Map<string, ExperienceDoc[]>()

    for (const doc of docs) {
      const company = doc.company ?? ''
      if (!byCompany.has(company)) {
        byCompany.set(company, [])
        companyOrder.push(company)
      }
      byCompany.get(company)!.push(doc)
    }

    let order = 0
    for (const company of companyOrder) {
      const roles = byCompany.get(company) ?? []
      roles.sort((a, b) => sortDate(b).localeCompare(sortDate(a)))
      for (const role of roles) {
        yield patch(role._id, [at('order', set(order))])
        order += 1
      }
    }
  },
})
