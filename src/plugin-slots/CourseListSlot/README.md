# Course List Slot

### Slot ID: `course_list_slot`

## Plugin Props

* courseListData — from `useCourseListData` in `/containers/CoursesPanel/hooks.js`

## Description

This slot is used for replacing or adding content around the `CourseList` component. The `CourseListSlot` is only rendered if the learner has enrolled in at least one course.

## Example

The space will show the `CourseList` component by default. This can be disabled in the configuration with the `keepDefault` boolean. 

![Screenshot of the CourseListSlot](./images/course_list_slot.png)

Setting the MFE's `env.config.jsx` to the following will replace the default experience with a list of course titles.

![Screenshot of a custom course list](./images/readme_custom_course_list.png)

```js
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

const config = {
  pluginSlots: {
    course_list_slot: {
      keepDefault: false,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom_course_list',
            type: DIRECT_PLUGIN,
            priority: 60,
            RenderWidget: ({ courseListData }) => {
							const courses = courseListData.visibleList;
							return (
								<div>
									{courses.map(courseData => (
										<p>
											{courseData.course.courseName}
										</p>
									))}
								</div>
							)
						},
          },
        },
      ],
    },
  },
}

export default config;
```