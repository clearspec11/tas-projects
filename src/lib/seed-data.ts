import type { Project } from './types';

// Every project here is real and every dollar figure is traceable to the cited
// source. See DATA_SOURCES.md for the per-project evidence and known gaps.
//
// Conventions:
//   original_budget  first publicly announced total cost
//   budget           latest official estimated total cost
//   spent            actual money paid out; null when no source publishes it
//   funding_note     used instead of (or alongside) funding_breakdown when the
//                    split is proposed, partial, or not published in dollars
// Coordinates are approximate, at site or town level.

const BP1_2026 =
	'https://www.treasury.tas.gov.au/Documents/2026-27%20Budget%20Paper%20No.%201%2c%20Budget%20Strategy%20and%20Estimates.PDF';
const CREATED = '2024-01-01T00:00:00Z';
const UPDATED = '2026-11-18T00:00:00Z';
const CHECKED = '2026-11-18';

const RAW_PROJECTS: Project[] = [
	// ── State and federal projects ──────────────────────────────────────────
	{
		id: '1',
		name: 'New Bridgewater Bridge',
		description:
			'Four-lane replacement for the Bridgewater Bridge over the River Derwent on the Midland Highway. The estimated cost rose from $576M to $786M in the 2022-23 Budget. The bridge was officially opened on 1 June 2025; the budget papers still carry funding to 2028 for remaining works, including removal of the old bridge.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 786_000_000,
		spent: null,
		original_budget: 576_000_000,
		lat: -42.7344,
		lng: 147.2333,
		location_name: 'Bridgewater',
		// "Since construction began in October 2022" (government release, 1 Jun 2025).
		start_date: '2022-10-01',
		// Budget Papers 2019-20 to 2022-23 listed completion in 2025.
		expected_end_date: '2025-12-31',
		actual_end_date: '2025-06-01',
		contractor: 'McConnell Dowell',
		related_project_ids: ['10'],
		// Estimated Total Cost: Budget Papers BP1, 2019-20 to 2026-27. Funding split:
		// 2026-27 BP1 Table 7.5 (State 157.2, Australian Government 628.8), matching
		// the Federation Funding Agreement land transport schedule.
		source_url: BP1_2026,
		funding_breakdown: { federal: 628_800_000, state: 157_200_000, local: 0, private: 0 },
		budget_history: [
			{ fiscal_year: '2019-20', estimated_total_cost: 576_000_000 },
			{ fiscal_year: '2020-21', estimated_total_cost: 576_000_000 },
			{ fiscal_year: '2021-22', estimated_total_cost: 576_000_000 },
			{ fiscal_year: '2022-23', estimated_total_cost: 786_000_000 },
			{ fiscal_year: '2023-24', estimated_total_cost: 786_000_000 },
			{ fiscal_year: '2024-25', estimated_total_cost: 786_000_000 },
			{ fiscal_year: '2026-27', estimated_total_cost: 786_000_000 }
		],
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '2',
		name: 'Royal Hobart Hospital Redevelopment (K-Block)',
		description:
			'Redevelopment of the Royal Hobart Hospital, centred on the new K-Block inpatient building. The total budget was set at $689M in December 2015. The Auditor-General reported $622M spent by October 2019, before completion; no final cost has been found. Practical completion was first set for December 2018, moved to August 2019, and was reported as reached on 17 March 2020.',
		category: 'health',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 689_000_000,
		spent: null,
		lat: -42.8821,
		lng: 147.3263,
		location_name: 'Hobart CBD',
		// June 2011 intergovernmental funding agreement.
		start_date: '2011-06-01',
		expected_end_date: '2018-12-31',
		// From the government's K-Block possession announcement, seen only as a
		// search-result quote (the page was unreachable).
		actual_end_date: '2020-03-17',
		contractor: 'John Holland Fairbrother Joint Venture',
		related_project_ids: [],
		// Tasmanian Auditor-General, Report No. 5 of 2019-20 (tabled 26 Nov 2019).
		source_url: 'https://www.audit.tas.gov.au/wp-content/uploads/Full-Report-RHH-Redevelopment-Project.pdf',
		funding_note:
			'The 2011 agreement provided $342.8M from the Australian Government ($240M of it from the Health and Hospitals Fund) and $225M from the Tasmanian Government. The source does not say who funded the later increase to $689M, so a full split is not shown.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '3',
		name: 'Launceston General Hospital Redevelopment - Stage 2',
		description:
			'Stage 2 of the Launceston General Hospital redevelopment, including a new mental health precinct and an expanded emergency department. The estimated cost rose from $580M to $634.7M by the 2026-27 Budget. Construction of the mental health precinct was scheduled to start in August 2026.',
		category: 'health',
		status: 'over_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 634_700_000,
		spent: null,
		original_budget: 580_000_000,
		lat: -41.4373,
		lng: 147.1352,
		location_name: 'Launceston',
		// Budget Papers list the project as starting in 2021.
		start_date: '2021-07-01',
		expected_end_date: '2032-06-30',
		contractor: null,
		related_project_ids: [],
		// Budget Papers BP1 (Estimated Total Cost): $580M in 2022-23 and 2023-24,
		// $634.7M in 2026-27 (Table 7.4). Stage 1 ($87.3M) is a separate line.
		source_url: BP1_2026,
		funding_breakdown: { federal: 0, state: 634_700_000, local: 0, private: 0 },
		funding_note:
			'Listed in the Budget Papers as a Tasmanian Government project. No Australian Government contribution was found.',
		budget_history: [
			{ fiscal_year: '2022-23', estimated_total_cost: 580_000_000 },
			{ fiscal_year: '2023-24', estimated_total_cost: 580_000_000 },
			{ fiscal_year: '2026-27', estimated_total_cost: 634_700_000 }
		],
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '4',
		name: 'Cradle Mountain Experience (cableway)',
		description:
			'Proposed cableway from the Cradle Mountain gateway to Dove Lake. It has not been built. The Budget Papers carried it at $65M in 2019-20 and $61M to 2023-24, with completion pushed from 2022 to 2026. The Australian Government withdrew its $30M after a 2023 deadline passed, and the 2026-27 Budget lists the project at $190M, dependent on Australian Government funding that has not been committed.',
		category: 'environment',
		status: 'over_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 190_000_000,
		spent: null,
		original_budget: 65_000_000,
		lat: -41.6371,
		lng: 145.9427,
		location_name: 'Cradle Mountain',
		start_date: null,
		expected_end_date: '2026-12-31',
		contractor: null,
		related_project_ids: [],
		// Budget Papers BP1 Ch6 "Cradle Mountain Experience", 2019-20 to 2023-24,
		// and 2026-27 BP1 Table 7.6 (Projects Contingent on Australian Government Funding).
		source_url: BP1_2026,
		funding_breakdown: { federal: 152_000_000, state: 38_000_000, local: 0, private: 0 },
		funding_note:
			'This is the split proposed in the 2026-27 Budget. The Australian Government share is not committed.',
		budget_history: [
			{ fiscal_year: '2019-20', estimated_total_cost: 65_000_000 },
			{ fiscal_year: '2020-21', estimated_total_cost: 61_000_000 },
			{ fiscal_year: '2021-22', estimated_total_cost: 61_000_000 },
			{ fiscal_year: '2022-23', estimated_total_cost: 61_000_000 },
			{ fiscal_year: '2023-24', estimated_total_cost: 61_000_000 },
			{ fiscal_year: '2026-27', estimated_total_cost: 190_000_000 }
		],
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '5',
		name: 'Tasman Highway - Great Eastern Drive upgrades',
		description:
			'Road widening, realignment and overtaking lanes on the Tasman Highway along the east coast, delivered in three packages: Apsley (Bicheno to Coles Bay Road), Triabunna and Lisdillon. Work on the Apsley package started in February 2025. The Triabunna start was announced for late 2025, then early 2026. No completion date for the whole program has been published.',
		category: 'transport',
		status: 'on_budget',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 125_000_000,
		spent: null,
		lat: -42.507,
		lng: 147.914,
		location_name: 'Triabunna',
		start_date: '2025-02-01',
		expected_end_date: null,
		contractor: null,
		related_project_ids: [],
		// Tasmanian Government releases of 28 Feb 2025 and 1 Nov 2025, read as
		// republished (premier.tas.gov.au was unreachable).
		source_url: 'https://www.miragenews.com/tenders-open-for-tasman-highway-triabunna-1562223/',
		funding_breakdown: { federal: 100_000_000, state: 25_000_000, local: 0, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '6',
		name: 'Devonport Living City - Stage 1',
		description:
			"First stage of Devonport City Council's CBD renewal: the paranaple centre, Providore Place, a multi-level car park and the arts centre. Announced at $70M and recorded by the council as $71M, completed in 2018. Later stages (the Waterfront Park and a privately built hotel) are separate.",
		category: 'community',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'Devonport City Council',
		budget: 71_000_000,
		spent: null,
		original_budget: 70_000_000,
		lat: -41.1801,
		lng: 146.3513,
		location_name: 'Devonport',
		start_date: null,
		expected_end_date: null,
		// The council page gives only the year, 2018.
		actual_end_date: '2018-12-31',
		contractor: null,
		related_project_ids: [],
		// Council page (cost, completion) and Prime Minister's release of 23 Jul 2018
		// ($10M federal, $13M state, remainder council).
		source_url: 'https://www.devonport.tas.gov.au/living-city-stage-1/',
		funding_breakdown: { federal: 10_000_000, state: 13_000_000, local: 48_000_000, private: 0 },
		funding_note:
			'The council share is the remainder after the stated $10M federal and $13M state contributions; no council dollar figure is published.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '7',
		name: 'UTAS southern campus move to Hobart CBD',
		description:
			'The University of Tasmania announced in 2019 that it would spend $600M relocating from Sandy Bay to central Hobart. In November 2024 it abandoned the full move and will keep some faculties at Sandy Bay. The Forestry Building on Melville Street was completed as part of the city campus. A $500M science and technology precinct at Sandy Bay is proposed but unfunded.',
		category: 'education',
		status: 'cancelled',
		funding_type: 'public',
		government_level: 'state',
		budget: 600_000_000,
		spent: null,
		lat: -42.8826,
		lng: 147.3257,
		location_name: 'Hobart CBD',
		start_date: '2019-01-01',
		expected_end_date: null,
		contractor: null,
		related_project_ids: [],
		// ABC News, 5 Nov 2024 and 7 Oct 2026 (secondary; utas.edu.au was unreachable).
		source_url: 'https://www.abc.net.au/news/2024-11-05/utas-to-keep-some-faculties-at-sandy-bay/104562652',
		funding_note:
			"Paid for by the university from its own funds and borrowings. No Australian or Tasmanian Government contribution to the move was found.",
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '8',
		name: 'Greater South East Irrigation Scheme',
		description:
			'Tasmanian Irrigation scheme to supply farms across the south east, integrating the existing South East schemes. Funding was approved in November 2024. Construction is planned to start in early 2028, with commissioning in mid-2030. No head contractor has been appointed.',
		category: 'utilities',
		status: 'on_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 301_000_000,
		spent: null,
		lat: -42.7725,
		lng: 147.5631,
		location_name: 'South East Tasmania',
		// Planned construction start.
		start_date: '2028-01-01',
		expected_end_date: '2030-06-30',
		contractor: null,
		related_project_ids: [],
		// Tasmanian Irrigation fact sheet, last updated May 2026.
		source_url:
			'https://tasmanianirrigation.com.au/source-assets/map-data/factsheets/APPROVED_Greater-South-East-Irrigation-Scheme-Fact-Sheet-25-May-26-1.pdf',
		funding_breakdown: { federal: 150_000_000, state: 75_000_000, local: 0, private: 75_000_000 },
		funding_note:
			'The private share is irrigators buying water entitlements. The published shares add to $300M against a $301M forecast cost.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '9',
		name: 'Cooee to Wynyard Coastal Pathway',
		description:
			'A 13.2 km shared walking and cycling path between Burnie and Wynyard. It was announced in 2017 as a $3.7M project; in 2019 the Tasmanian Government allocated $12M to deal with coastal erosion along the route, and the finished pathway cost $15.72M. It opened on 24 October 2024.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'Burnie City and Waratah-Wynyard Councils',
		budget: 15_720_000,
		spent: 15_720_000,
		original_budget: 3_700_000,
		lat: -41.0534,
		lng: 145.9064,
		location_name: 'Cooee to Wynyard',
		start_date: '2023-09-01',
		expected_end_date: null,
		actual_end_date: '2024-10-24',
		contractor: 'Shaw Contracting',
		related_project_ids: [],
		// Burnie City Council (cost, history, opening) and Waratah-Wynyard Council
		// (state funding, contractor, construction dates).
		source_url: 'https://www.burnie.tas.gov.au/Council/Projects/2024/Burnie-Coastal-Pathway',
		funding_breakdown: { federal: 0, state: 13_860_000, local: 1_860_000, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '10',
		name: 'Greater Hobart Rapid Bus Network - planning',
		description:
			'Planning and early design for a rapid bus network in Greater Hobart, starting with a northern suburbs corridor. Only this planning money is committed. A February 2026 business case put the whole network at about $860M; no construction funding has been committed and no contractor appointed.',
		category: 'transport',
		status: 'on_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 54_500_000,
		spent: null,
		lat: -42.8465,
		lng: 147.3085,
		location_name: 'Greater Hobart',
		// Australian Government payments are scheduled from 2024-25 to 2028-29.
		start_date: '2024-07-01',
		expected_end_date: '2029-06-30',
		contractor: null,
		related_project_ids: ['1'],
		// Federation Funding Agreement land transport schedule, Tasmania, 2025-26
		// Budget table: "Hobart Public Transport Infrastructure Planning".
		source_url:
			'https://federalfinancialrelations.gov.au/sites/federalfinancialrelations.gov.au/files/2026-02/TAS%20Funding%20Table%20Budget%202025-26.pdf',
		funding_breakdown: { federal: 40_500_000, state: 14_000_000, local: 0, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '11',
		name: 'West Coast Wilderness Railway funding',
		description:
			'Additional Tasmanian Government funding over four years for the state-owned heritage railway between Queenstown and Strahan. The money covers both capital works and running costs; no split between the two is published.',
		category: 'transport',
		status: 'on_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 28_300_000,
		spent: null,
		lat: -42.0789,
		lng: 145.5514,
		location_name: 'Queenstown',
		start_date: '2026-07-01',
		expected_end_date: '2030-06-30',
		contractor: null,
		related_project_ids: [],
		// 2026-27 BP1 policy table: 7.7 + 11.1 + 5.4 + 4.1 ($m, 2026-27 to 2029-30).
		source_url: BP1_2026,
		funding_breakdown: { federal: 0, state: 28_300_000, local: 0, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '13',
		name: 'Marinus Link - Stage 1',
		description:
			"A 750 MW undersea and underground electricity cable between Heybridge in north west Tasmania and Victoria. Marinus Link put the Stage 1 cost at $3.89B (2023 dollars) in July 2025. Owners made a final investment decision on 1 August 2025, a ceremonial start of construction was held at Heybridge in October 2026, and completion is scheduled for 2030. An industry pipeline tracker records the Stage 1 estimate as $2.9B in November 2023.",
		category: 'utilities',
		status: 'on_budget',
		funding_type: 'public',
		government_level: 'federal',
		budget: 3_890_000_000,
		spent: null,
		lat: -41.075,
		lng: 145.985,
		location_name: 'Heybridge',
		start_date: '2026-01-01',
		expected_end_date: '2030-12-31',
		contractor: 'Hitachi Energy, Prysmian, TasVic Greenlink',
		related_project_ids: ['17', '14'],
		// Marinus Link "Project Marinus costs and benefits" (July 2025) and the
		// Financial Close fact sheet (September 2025).
		source_url:
			'https://marinuslink.com.au/wp-content/uploads/2025/07/Project-Marinus-costs-and-benefits-WEB.pdf',
		funding_note:
			"20% is shareholder equity (at financial close: Australian Government 49%, Victoria 33.3%, Tasmania 17.7%) and 80% a concessional Australian Government loan through the Clean Energy Finance Corporation. Tasmania's equity is capped at $103M. Costs are recovered from electricity customers. Dollar amounts per shareholder are not published.",
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '14',
		name: 'Tarraleah Hydropower Redevelopment',
		description:
			"Hydro Tasmania's proposed rebuild of the Tarraleah scheme, lifting capacity from 90 MW to 190 MW. It is the main costed part of what was promoted as Battery of the Nation. The 2023 preliminary business case gave a base cost of $1.05B (2023 dollars); Hydro's March 2026 estimate is $1.96B (2024 dollars). No final investment decision has been made and no main contractor appointed. About $123M of early upgrade works has been approved.",
		category: 'utilities',
		status: 'over_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 1_960_000_000,
		spent: null,
		original_budget: 1_050_000_000,
		lat: -42.3,
		lng: 146.45,
		location_name: 'Tarraleah',
		// Preliminary business case, May 2023.
		start_date: '2023-05-01',
		expected_end_date: null,
		contractor: null,
		related_project_ids: ['13'],
		// Hydro Tasmania project overview (March 2026) and preliminary business case.
		source_url:
			'https://www.hydro.com.au/sites/default/files/2026-03/Tarraleah%20Redevelopment%20-%20Project%20overview%20March%202026.pdf',
		funding_note:
			'Only the early upgrade works are funded: $65M from the Australian Government and $58M from Hydro Tasmania. No funding for the $1.96B redevelopment has been announced.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '15',
		name: 'Hobart Airport Runway Upgrade',
		description:
			'Upgrade of the Hobart Airport runway and airfield. Works began in July 2024 with completion expected in mid-2025; the airport recorded the project as complete in August 2025. The airport is also building a separate $200M terminal expansion with its own money.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_funded_private',
		government_level: 'federal',
		budget: 130_000_000,
		spent: null,
		lat: -42.8361,
		lng: 147.5103,
		location_name: 'Cambridge',
		start_date: '2024-07-01',
		expected_end_date: '2025-06-30',
		actual_end_date: '2025-08-31',
		contractor: 'Downer',
		related_project_ids: [],
		// Hobart Airport media release, 1 May 2024, and the airport's project page.
		source_url:
			'https://hobartairport.com.au/wp-content/uploads/2024/05/1-May-2024-Hobart-Airport-130-million-Runway-Upgrade-Project-to-Unlock-Trifecta-of-Opportunities.pdf',
		funding_breakdown: { federal: 60_000_000, state: 0, local: 0, private: 70_000_000 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '16',
		name: 'Macquarie Point Multipurpose Stadium',
		description:
			"Multipurpose stadium at Macquarie Point on Hobart's waterfront. It was announced in 2022 at $715M; the 2026-27 Budget puts it at $1.13B, based on schematic designs rather than market prices. Site works began in July 2026 and a preferred builder was named in October 2026, with a fixed-price contract still to be signed. Completion is now expected in December 2030. The cost of the wider precinct has not been published.",
		category: 'community',
		status: 'over_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 1_130_000_000,
		spent: null,
		// Reported by Pulse Tasmania, 15 Apr 2026 (secondary).
		original_budget: 715_000_000,
		lat: -42.879,
		lng: 147.337,
		location_name: 'Hobart Waterfront',
		start_date: '2026-07-01',
		expected_end_date: '2030-12-31',
		contractor: null,
		related_project_ids: ['10'],
		// 2026-27 BP1 (Chapter 4: "total estimated cost of the Stadium is $1.13
		// billion") and BP4 (State $375M, Australian Government $240M, AFL $15M).
		source_url: BP1_2026,
		funding_breakdown: { federal: 240_000_000, state: 875_000_000, local: 0, private: 15_000_000 },
		funding_note:
			"The state share is a $375M commitment plus about $500M to be borrowed by the state-owned Macquarie Point Development Corporation; the borrowing figure is the remainder, not a published number. The $240M federal contribution is for the precinct as a whole. The private share is the AFL's $15M.",
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '17',
		name: 'North West Transmission Developments - Stage 1',
		description:
			"TasNetworks' 129 km of new and upgraded transmission lines from Cressy to Burnie via Sheffield, the on-island half of Project Marinus. The TasNetworks board approved a total cost estimate of $1.317B in May 2026; the Australian Energy Regulator approved cost recovery of $1.175B. Construction started on 31 August 2026 and completion is targeted for mid-2029.",
		category: 'utilities',
		status: 'on_budget',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 1_317_000_000,
		spent: null,
		lat: -41.383,
		lng: 146.333,
		location_name: 'Sheffield',
		start_date: '2026-08-31',
		expected_end_date: '2029-07-30',
		contractor: 'Genus',
		related_project_ids: ['13'],
		// TasNetworks releases of 8 May 2026 (financial close) and August 2026.
		source_url:
			'https://www.tasnetworks.com.au/config/getattachment/f1e619de-cb91-4102-9510-6efcb83744b7/North-West-Transmission-Developments-reaches-financial-close.pdf',
		funding_note:
			'Financed by a concessional Australian Government loan of up to $1.2B through the Clean Energy Finance Corporation and Tasmanian Government equity of $222M. A further $346M Australian Government grant is payable on completion. These overlap, so they are not shown as shares of the cost.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '18',
		name: 'UTAS Stadium Redevelopment',
		description:
			"Redevelopment of UTAS Stadium (York Park) in Launceston, with a new Centre West Stand and a rebuilt Eastern Stand. The stadium passed from the City of Launceston to the state's Stadiums Tasmania. Main construction was under way by September 2025, with completion scheduled for October 2027.",
		category: 'community',
		status: 'on_budget',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 130_000_000,
		spent: null,
		lat: -41.4259,
		lng: 147.1388,
		location_name: 'Invermay, Launceston',
		start_date: '2025-09-01',
		expected_end_date: '2027-10-31',
		contractor: 'Fairbrother',
		related_project_ids: [],
		// City of Launceston (17 Apr 2025, $130M); funding split, contractor and
		// dates from Pulse Tasmania, 11 Sep 2025 (secondary).
		source_url: 'https://www.launceston.tas.gov.au/News-Media/UTAS-Stadium-redevelopment-gets-green-light',
		funding_breakdown: { federal: 65_000_000, state: 65_000_000, local: 0, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: '19',
		name: 'Northern Suburbs Community Recreation Hub',
		description:
			"Community sport and recreation hub in Launceston's northern suburbs. The Budget Papers listed it at $27.5M in 2023-24, to finish in 2025; the 2026-27 Budget lists it at $61.5M, finishing in 2028. The first stage opened in March 2026.",
		category: 'community',
		status: 'over_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 61_500_000,
		spent: null,
		original_budget: 27_500_000,
		lat: -41.401,
		lng: 147.135,
		location_name: 'Launceston northern suburbs',
		start_date: '2023-07-01',
		expected_end_date: '2028-06-30',
		contractor: null,
		related_project_ids: [],
		// Budget Papers BP1: 2023-24 Ch6 ($27.5M, 2023 to 2025) and 2026-27 Table 7.4
		// ($61.5M, 2023 to 2028).
		source_url: BP1_2026,
		funding_note:
			'The Budget Papers note that the project includes Australian Government funding but do not give the amount.',
		budget_history: [
			{ fiscal_year: '2023-24', estimated_total_cost: 27_500_000 },
			{ fiscal_year: '2026-27', estimated_total_cost: 61_500_000 }
		],
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},

	// ── Local council projects (northern Tasmania) ──────────────────────────
	// Figures from council pages and media releases. Where a council share is
	// given as "the remainder", it is the total less the stated grants.
	{
		id: 'c11',
		name: 'Longford Recreation Ground Redevelopment',
		description:
			'New player and umpire changerooms, upgraded grandstand seating, entrance and car park at the Longford Recreation Ground, bringing it to AFL regional standard. Officially opened on 15 October 2021.',
		category: 'community',
		status: 'completed',
		funding_type: 'public',
		government_level: 'local',
		council: 'Northern Midlands Council',
		budget: 2_900_000,
		spent: 2_900_000,
		lat: -41.596,
		lng: 147.123,
		location_name: 'Longford',
		start_date: null,
		expected_end_date: null,
		actual_end_date: '2021-10-15',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://nmc.tas.gov.au/news/2021/media-release-longford-recreation-ground-officially-opened',
		funding_breakdown: { federal: 0, state: 313_409, local: 2_586_591, private: 0 },
		funding_note:
			'State grants were $80,000 from Sport and Recreation Tasmania and $233,409 from Levelling the Playing Field. The council share is the remainder.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c13',
		name: 'Albert Hall Redevelopment',
		description:
			"Renewal of Launceston's 1891 Albert Hall, including a new Eastern Wing. The council described it as a $16M project in July 2023 and as a completed $20M redevelopment on its project page. Completion had been expected in the first quarter of 2025 and was later targeted for spring 2025.",
		category: 'community',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'City of Launceston',
		budget: 20_000_000,
		spent: null,
		original_budget: 16_000_000,
		lat: -41.4337,
		lng: 147.1437,
		location_name: 'Launceston',
		start_date: null,
		expected_end_date: '2025-03-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.launceston.tas.gov.au/Business-and-Development/Major-Projects/Albert-Hall-Redevelopment',
		funding_breakdown: { federal: 11_000_000, state: 0, local: 8_900_000, private: 0 },
		funding_note:
			'The Australian Government pledged $11M under the Launceston City Deal. The council committed $5M in 2023 and a further $3.9M in March 2025.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c14',
		name: 'Princess Theatre and Earl Arts Centre Redevelopment',
		description:
			'Restoration of the heritage Princess Theatre and replacement of the Earl Arts Centre with a new theatre. Construction began in early 2026 and both venues are expected to reopen in early 2028.',
		category: 'community',
		status: 'on_budget',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'City of Launceston',
		budget: 30_000_000,
		spent: null,
		lat: -41.4366,
		lng: 147.142,
		location_name: 'Launceston',
		start_date: '2026-01-01',
		expected_end_date: '2028-03-31',
		contractor: 'Fairbrother',
		related_project_ids: [],
		source_url:
			'https://www.launceston.tas.gov.au/Business-and-Development/Major-Projects/Princess-Theatre-Earl-Arts-Centre-Redevelopment',
		funding_breakdown: { federal: 12_700_000, state: 0, local: 17_300_000, private: 0 },
		funding_note:
			'Jointly funded by the City of Launceston and the Australian Government, which contributed $12.7M through the Growing Regions Program. The council share is the remainder.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c15',
		name: 'George Town Aquatic, Health and Wellbeing Centre',
		description:
			"Indoor year-round centre with an enclosed 25 m pool, gym and therapy rooms, replacing George Town's outdoor pool. Scheduled to be operational by October 2026. Opening has been reported but not confirmed from a council source.",
		category: 'community',
		status: 'on_budget',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'George Town Council',
		budget: 17_500_000,
		spent: null,
		lat: -41.106,
		lng: 146.826,
		location_name: 'George Town',
		// "Construction commenced August 2025" (council quarterly report).
		start_date: '2025-08-01',
		expected_end_date: '2026-10-31',
		// Named as builder by Pulse Tasmania, 11 Nov 2025 (secondary).
		contractor: 'Fairbrother',
		related_project_ids: [],
		source_url: 'https://georgetown.tas.gov.au/projects/aquatic-health-wellbeing-centre',
		funding_breakdown: { federal: 15_000_000, state: 2_500_000, local: 0, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c16',
		name: 'Legana Sports Oval',
		description:
			'Full-size community oval with a cricket pitch, lighting and fencing beside the new Legana Primary School. Civil work began in December 2023 and was completed by late May 2024; the oval was officially opened on 1 February 2025.',
		category: 'community',
		status: 'completed',
		funding_type: 'public',
		government_level: 'local',
		council: 'West Tamar Council',
		budget: 2_500_000,
		spent: 2_500_000,
		lat: -41.366,
		lng: 147.045,
		location_name: 'Legana',
		start_date: '2023-12-01',
		expected_end_date: null,
		actual_end_date: '2024-05-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.wtc.tas.gov.au/2025/02/community-celebrates-legana-oval-opening',
		funding_breakdown: { federal: 519_000, state: 410_000, local: 1_571_000, private: 0 },
		funding_note: 'The council share is the remainder after the stated federal and state grants.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c18',
		name: 'Perth Early Learning Centre',
		description:
			'Purpose-built early learning centre beside the Perth kindergarten and primary school. The 2019 business case estimated $2.65M; the construction contract was awarded in September 2021 with the project at $3.53M, after the council enlarged the design. Completion was expected in late 2022.',
		category: 'education',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'Northern Midlands Council',
		budget: 3_530_000,
		spent: null,
		original_budget: 2_650_000,
		lat: -41.573,
		lng: 147.172,
		location_name: 'Perth',
		start_date: '2021-10-01',
		expected_end_date: '2022-12-31',
		contractor: 'R&T Rosier Constructions',
		related_project_ids: [],
		source_url:
			'https://northernmidlands.tas.gov.au/news/2021/media-release-council-awards-construction-contract-for-new-perth-early-learning-centre',
		funding_note:
			'Funded by Australian Government grants: $2.6M announced in 2019 and $1.12M under the Local Roads and Community Infrastructure program. The council supplied the land and site works, valued at $433,000. The grant figures come from different announcements and do not add neatly to the project cost.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c19',
		name: 'Launceston City Heart - Stage 1',
		description:
			"Renewal of Launceston's central shopping district: Civic Square, the Brisbane Street Mall and the Quadrant Mall. The council described it as a $19.1M project in August 2018; the contributions it listed that December add to $20.3M. Civic Square was finished in July 2018 and the mall reopened on 14 December 2018.",
		category: 'community',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'City of Launceston',
		budget: 20_338_000,
		spent: null,
		original_budget: 19_100_000,
		lat: -41.438,
		lng: 147.138,
		location_name: 'Launceston CBD',
		start_date: null,
		expected_end_date: null,
		actual_end_date: '2018-12-14',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.launceston.tas.gov.au/News-Media/Launceston-launches-revitalised-shopping-district',
		funding_breakdown: { federal: 7_500_000, state: 5_800_000, local: 7_038_000, private: 0 },
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},
	{
		id: 'c20',
		name: 'Newstead Flood Levee',
		description:
			'Flood levee at Hart Street, Newstead, described by the council as a $1.2M project. Works were complete in December 2018.',
		category: 'environment',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'local',
		council: 'City of Launceston',
		budget: 1_200_000,
		spent: null,
		lat: -41.437,
		lng: 147.165,
		location_name: 'Newstead, Launceston',
		start_date: null,
		expected_end_date: null,
		actual_end_date: '2018-12-19',
		contractor: 'Baker Building and Civil Contracting',
		related_project_ids: [],
		source_url: 'https://www.launceston.tas.gov.au/News-Media/Newstead-Flood-Levee-works-complete',
		funding_breakdown: { federal: 250_000, state: 0, local: 950_000, private: 0 },
		funding_note: 'The council share is the remainder after the stated $250,000 federal contribution.',
		last_verified: CHECKED,
		created_at: CREATED,
		updated_at: UPDATED
	},

	// ── Completed historical projects (pre-2017) ────────────────────────────
	// Names, costs (Estimated Total Cost) and years verified from Tasmanian
	// Budget Papers BP1 Ch6, Budget 2015-16 / 2016-17. Locations are town-level.
	// The papers give an estimated total cost, not audited final spend, so `spent`
	// is left null except where a final figure is separately sourced.
	{
		id: 'h01',
		name: 'Three Capes Track',
		description: "Multi-day wilderness walking track around the Tasman Peninsula's coastal cliffs, with new huts and trailhead facilities, delivered by the Parks and Wildlife Service.",
		category: 'environment',
		status: 'completed',
		funding_type: 'public',
		government_level: 'state',
		budget: 25_000_000,
		spent: null,
		lat: -43.13,
		lng: 147.95,
		location_name: 'Tasman Peninsula',
		start_date: '2010-07-01',
		expected_end_date: '2015-12-31',
		actual_end_date: '2015-12-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h02',
		name: 'North East Freight Roads',
		description: 'Upgrades to freight routes across north-east Tasmania to support the forestry and agricultural sectors, including pavement strengthening and bridge works.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 34_000_000,
		spent: null,
		lat: -41.16,
		lng: 147.52,
		location_name: 'Scottsdale, North East',
		start_date: '2009-07-01',
		expected_end_date: '2015-12-31',
		actual_end_date: '2015-12-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h03',
		name: "Royal Hobart Hospital Women's and Children's Precinct",
		description: "New women's and children's precinct at the Royal Hobart Hospital, expanding maternity, neonatal and paediatric facilities.",
		category: 'health',
		status: 'completed',
		funding_type: 'public',
		government_level: 'state',
		budget: 100_000_000,
		spent: null,
		lat: -42.8821,
		lng: 147.3263,
		location_name: 'Hobart CBD',
		start_date: '2010-07-01',
		expected_end_date: '2016-12-31',
		actual_end_date: '2016-12-31',
		contractor: null,
		related_project_ids: ['2'],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h04',
		name: 'Brooker Highway Upgrades - Elwick, Goodwood, Howards Roads',
		description: "Intersection and capacity upgrades along the Brooker Highway at Elwick, Goodwood and Howards Roads to ease congestion into Hobart's northern suburbs.",
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 26_000_000,
		spent: null,
		lat: -42.83,
		lng: 147.28,
		location_name: 'Glenorchy',
		start_date: '2015-07-01',
		expected_end_date: '2017-06-30',
		actual_end_date: '2017-06-30',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h05',
		name: 'Risdon Prison Infrastructure Redevelopment',
		description: 'Redevelopment of correctional infrastructure at the Risdon Prison complex, including upgraded accommodation and facilities.',
		category: 'community',
		status: 'completed',
		funding_type: 'public',
		government_level: 'state',
		budget: 20_000_000,
		spent: null,
		lat: -42.79,
		lng: 147.37,
		location_name: 'Risdon Vale',
		start_date: '2011-07-01',
		expected_end_date: '2014-12-31',
		actual_end_date: '2014-12-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h06',
		name: 'Huon Highway / Summerleas Road Intersection',
		description: 'Grade-separated upgrade of the Huon Highway and Summerleas Road intersection south of Hobart to improve safety and traffic flow.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 18_000_000,
		spent: null,
		lat: -42.99,
		lng: 147.27,
		location_name: 'Kingston',
		start_date: '2015-07-01',
		expected_end_date: '2017-06-30',
		actual_end_date: '2017-06-30',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h07',
		name: 'South Arm Highway / Rokeby Main Road Upgrade',
		description: "Upgrade of the South Arm Highway and Rokeby Main Road intersection serving Hobart's eastern shore.",
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 15_000_000,
		spent: null,
		lat: -42.86,
		lng: 147.49,
		location_name: 'Rokeby',
		start_date: '2015-07-01',
		expected_end_date: '2017-06-30',
		actual_end_date: '2017-06-30',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h08',
		name: 'Tasman Bridge Eastern Approach Ramps',
		description: 'Upgrade of the eastern approach ramps to the Tasman Bridge, improving access between Hobart and the eastern shore.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 15_000_000,
		spent: null,
		lat: -42.86,
		lng: 147.35,
		location_name: 'Hobart',
		start_date: '2013-07-01',
		expected_end_date: '2016-12-31',
		actual_end_date: '2016-12-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget2016/BP1/2016-17-BP1-6-Infrastructure-Investment.htm',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h09',
		name: 'Brighton Bypass',
		description: 'Federally funded 9.5 km dual-carriageway bypass of the Midland Highway around Brighton and Pontville, north of Hobart. Opened ahead of schedule in November 2012.',
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'federal',
		budget: 191_000_000,
		spent: null,
		lat: -42.7,
		lng: 147.24,
		location_name: 'Brighton',
		start_date: '2009-04-01',
		expected_end_date: '2012-11-12',
		actual_end_date: '2012-11-12',
		contractor: null,
		related_project_ids: ['1'],
		source_url: 'https://en.wikipedia.org/wiki/Brighton_Bypass',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h10',
		name: 'Kingston Bypass',
		description: "2.8 km bypass of Kingston connecting the Southern Outlet to the Channel Highway, south of Hobart. Opened 2011; the cost rose from a $30M estimate to a $41M final figure.",
		category: 'transport',
		status: 'completed',
		funding_type: 'gov_contracted',
		government_level: 'state',
		budget: 30_000_000,
		spent: 41_000_000,
		original_budget: 30_000_000,
		lat: -42.98,
		lng: 147.31,
		location_name: 'Kingston',
		start_date: '2010-02-01',
		expected_end_date: '2011-12-31',
		actual_end_date: '2011-12-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://en.wikipedia.org/wiki/Kingston_Bypass',
		budget_history: [
			{ fiscal_year: '2010 est.', estimated_total_cost: 30_000_000 },
			{ fiscal_year: '2011 final', estimated_total_cost: 41_000_000 }
		],
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	},
	{
		id: 'h11',
		name: 'Tasmanian Museum and Art Gallery Redevelopment',
		description: "$30M redevelopment of the Tasmanian Museum and Art Gallery on Hobart's historic waterfront, adding over 2,000 m² of public and exhibition space. Opened March 2013.",
		category: 'community',
		status: 'completed',
		funding_type: 'public',
		government_level: 'state',
		budget: 30_000_000,
		spent: null,
		lat: -42.8893,
		lng: 147.3346,
		location_name: 'Hobart Waterfront',
		start_date: '2011-01-01',
		expected_end_date: '2013-03-31',
		actual_end_date: '2013-03-31',
		contractor: null,
		related_project_ids: [],
		source_url: 'https://www.tmag.tas.gov.au',
		last_verified: '2026-06-14',
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-06-01T00:00:00Z'
	}
];

export const SEED_PROJECTS: Project[] = RAW_PROJECTS;
