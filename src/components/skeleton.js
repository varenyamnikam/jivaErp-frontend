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

export default function MuiSkeleton(props) {
  const skeleton = [, , , , , , , , , ,];
  console.log(skeleton.length);

  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>{" "}
      <TableRow>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />{" "}
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="75%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="25%" height={50} />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
