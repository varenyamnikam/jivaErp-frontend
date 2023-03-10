import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";
import Skeleton from "@mui/material/Skeleton";

export default function MuiSkeleton({ col = 6 }) {
  const skeleton = [, , , , , , , , , ,];
  console.log(skeleton.length);
  let n = 8;
  return (
    <TableBody>
      {[...Array(n)].map((e, i) => (
        <TableRow>
          <TableCell colSpan={10}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={30}
              animation="wave"
            />{" "}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
