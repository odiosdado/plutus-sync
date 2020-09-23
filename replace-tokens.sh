#!/bin/bash

file=$1
expressions=()
for var in $(compgen -e); do
    token="{{${var}}}"
    token_value="${!var}"
    if grep -q $token $file; then
        echo "Found token: $token"
        search="-e s|$token|$token_value|g"
        expressions+=("$search")
    fi
done
replace="sed -i ${expressions[@]} $file"
echo $replace
$replace