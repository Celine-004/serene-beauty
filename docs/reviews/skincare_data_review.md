# QA Data Validation Report

**Project:** Serene Beauty - Skincare Routine Web Application

**Test Date:** [15.12.2025]

**Tested By:** [Jilan KOURDI]

**Data File(s) Reviewed:** [cleansers.json, moisturizers.json, serums.json, sunscreens.json, toners.json, treatments.json]

**Version:** [1.0]



## 1. File Information

| Field         | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| File Name     | Multiple JSON data files                                            |
| Author        | Antonios KARAFENTZOS                                                |
| Date Created  | 14.12.2025                                                          |
| Total Records | Multiple (product categories, routines, quiz, concerns, skin types) |



## 2. Structure Validation

| Check                               | Status | Notes                                  |
| ----------------------------------- | ------ | ---------------------------------------|
| Valid JSON format                   | Pass | All files parse correctly                |
| Metadata present                    | Pass | Metadata present in all files            |
| Required fields present             | Fail | Missing or empty `id`, `targetConcerns`, `keyIngredients`(ingredients), `url`, `allIngredient` fields |
| Consistent field naming (camelCase) | Pass |                |
| No duplicate IDs                    | Pass | existing IDs are unique                           |
| Sources included                    | Fail | URLs missing    |



## 3. Field Validation

### Required Fields Check
| Field          | Present in All Records | Valid Format | Notes                       |
| -------------- | ---------------------- | ------------ | --------------------------- |
| id             | failed                 | passed       | lower_with_underscores      |
| name           | passed                 | passed       |                             |
| brand          | passed                 | passed       |                             |
| category       | passed                 | passed       |                             |
| suitableFor    | passed                 | passed       |                             |
| priceRange     | passed                 | passed       |                             |
| ingredients    | passed                 | passed       |                             |
| targetConcerns | failed                 | failed       | acceptable options are: acne, dryness, oiliness, sensitivity, redness, uneven_texture, dullness, large_pores, fine_lines, dark_spots                            |
| url            | failed                 | failed       | no product url|
| allIngredients | failed                 | failed       | Missing or unverifiable     |
|

### Value Validation
| Field | Valid Values | Invalid Entries Found | Notes|
|-------|--------------|----------------------|-------|
|  name |  passed      | passed               |       |
|brand  |  passed      | passed               |       |
| suitableFor | oily, dry, combination, sensitive, normal | acne, dryness, oiliness, sensitivity, redness, uneven_texture, dullness, large_pores, fine_lines, dark_spots| Invalues do not conform to defined skin types, should create a targetConcern field for  the invalid fields rather than adding them to the suitableFor fiels. |
|  ingredients |  passed      | passed               |       |
| category | cleanser, toner, serum, treatment, moisturizer, sunscreen | None | All categories align with routine steps |
| priceRange | budget, mid-range, premium | None | All values fall within allowed ranges |



## 4. Content Validation

| Check                                  | Status | Notes                                |
| -------------------------------------- | ------ | ------------------------------------ |
| Descriptions are clear and informative |  Pass  |                                      |
| No spelling/grammar errors             |  Fail  | Field naming typo `ingriedients`, should be keyIngredients                   |
| URLs are valid and accessible          |  Fail  | Homepage redirects / page not found  |
| No empty required fields               |  Pass  |                                      |



## 5. Cross-Reference Validation

| Check                                | Status | Notes |
| ------------------------------------ | ------ | ----- |
| Skin types match skin-types.json     |  Pass  |       |
| Concerns match skin-concerns.json    |  Pass  |       |
| Categories match routines.json steps |  Pass  |       |




## 6. Summary

| Category        | Total Checks | Passed | Failed |
| --------------- | ------------ | ------ | ------ |
| Structure       | 6            | 4      | 2      |
| Fields          |         10   | 6      | 4      |
| Content         | 4            | 2      | 2      |
| Cross-Reference | 3            | 3      | 0      |
| **Total**       | **23**       | **15** | **8**  |




## 7. Issues Found

| Issue ID | Severity | File              | Record(s) Affected | Field            | Description                      | Suggested Fix                    |
| -------- | -------- | ----------------- | ------------------ | ---------------- | -------------------------------- | -------------------------------- |
| DATA-001 | Medium   | all product files | All records        | ingriedients/ingredients | Typo / inconsistent naming       | Rename to `keyIngredients`       |



## 8. Recommendations

- add `id` fiels in the format of "brand_product_name"
- Include product URLs with verified, product-specific pages
- add `targetConcerns` fiels with the appropriate options(mentioned above)
- Populate complete allIngredient lists for all product files
- Fix naming inconsistency in ingredients field



## 9. Conclusion

The dataset demonstrates a solid structural foundation and correct cross-file relationships. However, high-severity issues related to missing URLs and missing ingredient data prevent full validation. These issues must be resolved before the data can be considered ready for implementation.


## 10. Sign-off

**Validation Completed:** [15.12.2025]

**Data Ready for Implementation:**  No (requires fixes)

**Author:** [Jilan KOURDI]