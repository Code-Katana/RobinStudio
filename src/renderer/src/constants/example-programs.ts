export const helloWorldProgram = `program first_program is
begin
  write "Hello, World!";
end
`;

export const bubbleSortProgram = `func [integer] bubble_sort has
    var arr: [integer];
    var l: integer;
begin

  var swapped: boolean;

  for i = 0; i < l; ++i do

    swapped = false;

    for j = 0; j < l - i - 1; ++j do
      if arr[j + 1] < arr[j] then
        swapped = true;
        var tmp: integer = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      end if
    end for

    if not(swapped) then
      return arr;
    end if

  end for

  return arr;
end func

program algo is
  var a, b, c, d, e: integer;
  var n: integer = 5;
begin
  write "Enter 5 integers: \n";

  read a, b, c, d, e;

  var arr: [integer] = bubble_sort({ a, b, c, d, e }, n);

  write "after sorting...";

  for i = 0; i < n; ++i do
    write "#", i + 1, "-> ", arr[i];
  end for
end
`;

export const sumOfNExample = `func integer n_sum has
  var n: integer;
begin
  var sum: integer = 0;

  for i = 1; i <= n; ++i do
    sum = sum + i;
  end for

  return sum;
end func

program sum_of_n_integers is
begin
  var x: integer;

  write "Enter the number n: ";
  read x;

  var sum: integer = n_sum(x);
  write "the sum of ", n, " numbers is ", sum;
end
`;

export const displayPatternExample = `func void display_pattern has
  var r: integer;
  var ch: string = "*";
begin

  for i = r; i > 0; --i do
    var row: string = "";

    for j = 0; j < i; ++j do
      row = row + ch;
    end for

    write row;
  end for

end func;

program lab2 is
begin
  var n: integer;
  write "Enter number of rows";
  read n;

  display_pattern(n);
  display_pattern(n * 2, "@");
end
`;
