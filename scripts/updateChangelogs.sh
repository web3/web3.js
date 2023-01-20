#!/bin/bash

header_name=$1

# Check if the header name is provided
if [ -z "$header_name" ]; then
	echo "Please provide a header name as the first argument"
	exit 1
fi

changelog="CHANGELOG.md"
headers_of_updates=() #this will track which kinds of headers are met in changelog.mds (Added, fixed, etc...)
changes=()

sed -i "" "s/\[Unreleased\]/"\[$header_name\]"/g" $changelog
echo "" >>$changelog

# Find all $($changelog) files in the packages/**/ folders
for file in $(find packages -name $changelog -not -path "*node_modules*"); do

	# Check if there are any non-empty lines, meaning we have updates
	lines_count=$(awk '/\[Unreleased\]/,EOF' $file | awk 'NF' | wc -l)

	if [ $lines_count -gt 1 ]; then

		# Extract the package name from the file path
		package_name=$(echo $file | awk -F '/' '{print $(NF-1)}')
		sed -i "" "s/\[Unreleased\]/[$header_name]/g" $file

		unreleased_changes=$(awk "/$header_name/,EOF" $file)

		# Replace the [Unreleased] header with the new header name, add at
		unreleased_changes=${unreleased_changes//## $header_name/}

		# echo $unreleased_changes
		IFS=$'\n' read -d '' -r -a lines <<<"$unreleased_changes"
		lines+=("EOF")

		index=-1 # the position of the header in the `headers_of_updates` array (Cannot use key-value ds in v3 bash)
		current_changes=""
		for line in "${lines[@]}"; do

			if [[ $line =~ ^\#\#\# || $line == EOF ]]; then
				# Just found a header of updates, check if we have already found it in a previous file
				# If have found a previous header append the changes there (meaning: we found a new ### header, append to array all gathered ## headers)
				if [[ $index -ge 0 ]]; then

					changes[$index]+=$current_changes
					changes[$index]+=$"\n"

				fi
				if [[ $line == EOF ]]; then
					break
				fi
				index=-1 # the position of the header in the `headers_of_updates` array (Cannot use key-value ds in v3 bash)

				current_changes="\n#### $package_name \n"

				IFS=$'\n'
				header=$line

				for i in "${!headers_of_updates[@]}"; do
					# echo "Item already exists at position $index in the array"
					if [[ "${headers_of_updates[i]}" == "$header" ]]; then
						index=$i
						break
					fi
				done
				if ! [[ $index -ge 0 ]]; then
					headers_of_updates+=("$header")
					index=$(expr ${#headers_of_updates[@]} - 1)
				fi
			elif [[ $line == -* ]]; then # True if line starts with a -
				current_changes+="\n$line"
			else
				current_changes+=$line
			fi

		done

		echo "" >>$file
		# echo without new line
		echo -ne "## [Unreleased]" >>$file
	fi

done

for i in "${!changes[@]}"; do
	echo -e ${headers_of_updates[i]} >>$changelog
	echo -e ${changes[i]} >>$changelog
done

echo "## [Unreleased]" >>$changelog
